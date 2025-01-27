import { Module } from '@nestjs/common';
import { TrialsResolver } from './resolvers/trials.resolver';
import { TrialsService } from './services/trials.service';
import { PrismaService } from 'src/common/prisma.service';
import { ParticipantsService } from './services/participants.service';
import { ParticipantsResolver } from './resolvers/participants.resolver';
import { EnrollmentUseCase } from './business/enrollment.usecase';

@Module({
  providers: [
    TrialsResolver,
    TrialsService,
    PrismaService,
    ParticipantsService,
    ParticipantsResolver,
    EnrollmentUseCase,
  ],
})
export class TrialsModule {}
