import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/common/prisma.service';

interface CreateTrialDto {
  name: string;
}

@Injectable()
export class TrialsService {
  constructor(private prisma: PrismaService) {}

  async createTrial(dto: CreateTrialDto) {
    return this.prisma.trial.create({
      data: {
        name: dto.name,
      },
    });
  }

  async getTrials(whereInput?: Prisma.TrialWhereInput) {
    return this.prisma.trial.findMany({ where: whereInput });
  }

  async getParticipantsByTrialId(trialId: number) {
    return this.prisma.participant.findMany({
      where: {
        trialId: trialId,
      },
    });
  }

  async getTrial(id: number, includeParticipants: boolean = false) {
    return this.prisma.trial.findUnique({
      where: { id },
      include: {
        participants: includeParticipants,
      },
    });
  }

  async getTrialsWithParticipantCounts() {
    return this.prisma.trial.findMany({
      include: {
        _count: {
          select: { participants: true },
        },
      },
    });
  }
}
