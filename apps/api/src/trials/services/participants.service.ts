import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/common/prisma.service';

@Injectable()
export class ParticipantsService {
  constructor(private prisma: PrismaService) {}

  async getParticipants() {
    return this.prisma.participant.findMany();
  }

  async getParticipant(id: number) {
    return this.prisma.participant.findUnique({
      where: { id },
    });
  }

  async createParticipant(data: {
    name: string;
    height: number;
    weight: number;
    hasDiabetes: boolean;
    hadCovid: boolean;
    trialId: number;
  }) {
    return this.prisma.participant.create({
      data,
    });
  }
}