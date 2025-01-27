import { Injectable, NotFoundException } from '@nestjs/common';
import { ParticipantsService } from '../services/participants.service';
import { TrialsService } from '../services/trials.service';
import { Participant } from 'src/graphql';

interface EnrollParticipantDto {
  trialId: number;
  hadCovid: boolean;
  hasDiabetes: boolean;
  weight: number;
  height: number;
  name: string;
}

interface EnrollmentResult {
  participant: Omit<Participant, 'trial'> | null;
  isEligible: boolean;
  ineligibilityReasons: string[];
}

@Injectable()
export class EnrollmentUseCase {
  constructor(
    private participantsService: ParticipantsService,
    private trialsService: TrialsService,
  ) {}

  private calculateBMI(weight: number, height: number): number {
    return (weight / (height * height)) * 703;
  }

  private checkEligibility(dto: EnrollParticipantDto): { isEligible: boolean; reasons: string[] } {
    const reasons: string[] = [];
    const bmi = this.calculateBMI(dto.weight, dto.height);

    if (!dto.hasDiabetes) {
      reasons.push('Participant does not have diabetes');
    }

    if (dto.hadCovid) {
      reasons.push('Participant has had COVID');
    }

    if (bmi <= 18) {
      reasons.push(`BMI (${bmi.toFixed(1)}) is too low - must be above 18`);
    }

    if (bmi >= 30) {
      reasons.push(`BMI (${bmi.toFixed(1)}) is too high - must be below 30`);
    }

    return {
      isEligible: reasons.length === 0,
      reasons,
    };
  }

  async enrollParticipant(dto: EnrollParticipantDto): Promise<EnrollmentResult> {
    // Validate if trial exists
    const trial = await this.trialsService.getTrial(dto.trialId, false);
    if (!trial) {
      throw new NotFoundException('Trial not found');
    }

    // Check eligibility
    const { isEligible, reasons } = this.checkEligibility(dto);
    if (!isEligible) {
      return {
        participant: null,
        isEligible,
        ineligibilityReasons: reasons,
      };
    }

    // Create participant
    const participant = await this.participantsService.createParticipant({
      trialId: dto.trialId,
      hadCovid: dto.hadCovid,
      hasDiabetes: dto.hasDiabetes,
      weight: dto.weight,
      height: dto.height,
      name: dto.name,
    });

    return {
      participant,
      isEligible,
      ineligibilityReasons: reasons,
    };
  }
}
