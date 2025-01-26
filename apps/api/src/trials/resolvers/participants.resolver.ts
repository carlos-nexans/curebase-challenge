import { Resolver, Query, Mutation, Args, ResolveField, Parent, Info } from '@nestjs/graphql';
import { TrialsService } from '../services/trials.service';
import { Participant } from 'src/graphql';
import { ParticipantsService } from '../services/participants.service';
import { FieldNode } from 'graphql';
import { GraphQLResolveInfo } from 'graphql';

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
  async createParticipant(
    @Args('name') name: string,
    @Args('height') height: number,
    @Args('weight') weight: number,
    @Args('hasDiabetes') hasDiabetes: boolean,
    @Args('hadCovid') hadCovid: boolean,
    @Args('trialId') trialId: number,
  ) {
    throw new Error('Not implemented');
  }

  @ResolveField('trial')
  async getTrial(@Parent() participant: Participant, @Info() info: GraphQLResolveInfo) {
    return this.trialsService.getTrial(participant.trialId, false);
  }
}