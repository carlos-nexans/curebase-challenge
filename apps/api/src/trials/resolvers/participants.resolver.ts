import {
  Resolver,
  Query,
  Mutation,
  Args,
  ResolveField,
  Parent,
} from '@nestjs/graphql';
import { TrialsService } from '../services/trials.service';
import { Participant } from 'src/graphql';
import { ParticipantsService } from '../services/participants.service';

@Resolver('Participant')
export class ParticipantsResolver {
  constructor(
    private participantsService: ParticipantsService,
    private trialsService: TrialsService,
  ) {}

  @Query('participants')
  async getParticipants() {
    return this.participantsService.getParticipants();
  }

  @Query('participant')
  async getParticipant(@Args('id') id: number) {
    return this.participantsService.getParticipant(id);
  }

  @Mutation('createParticipant')
  async createParticipant() {
    // @Args('trialId') trialId: number, // @Args('hadCovid') hadCovid: boolean, // @Args('hasDiabetes') hasDiabetes: boolean, // @Args('weight') weight: number, // @Args('height') height: number, // @Args('name') name: string,
    throw new Error('Not implemented');
  }

  @ResolveField('trial')
  async getTrial(@Parent() participant: Participant) {
    return this.trialsService.getTrial(participant.trialId, false);
  }
}
