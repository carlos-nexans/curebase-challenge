import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class TrialsService {
  constructor(private prismaService: PrismaService) {}

  async getTrials(whereInput?: Prisma.TrialWhereInput) {
    return this.prismaService.trial.findMany({ where: whereInput });
  }

  async getParticipantsByTrialId(trialId: number) {
    return this.prismaService.participant.findMany({
      where: {
        trialId: trialId
      }
    });
  }

  async getTrial(id: number, includeParticipants: boolean = false) {
    return this.prismaService.trial.findUnique({
      where: { id },
      include: {
        participants: includeParticipants
      }
    });
  }

  async getTrialsWithParticipantCounts() {
    return this.prismaService.trial.findMany({
      include: {
        _count: {
          select: { participants: true }
        }
      }
    });
  }
}
