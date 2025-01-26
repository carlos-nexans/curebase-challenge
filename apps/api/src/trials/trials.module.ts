import { Module } from '@nestjs/common';
import { TrialsResolver } from './resolvers/trials.resolver';
import { TrialsService } from './services/trials.service';
import { PrismaService } from 'src/common/prisma.service';
import { ParticipantsService } from './services/participants.service';
import { ParticipantsResolver } from './resolvers/participants.resolver';

@Module({
  providers: [
    TrialsResolver,
    TrialsService,
    PrismaService,
    ParticipantsService,
    ParticipantsResolver,
  ],
})
export class TrialsModule {}
