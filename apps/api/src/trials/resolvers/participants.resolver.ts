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
import { EnrollmentUseCase } from '../business/enrollment.usecase';

@Resolver('Participant')
export class ParticipantsResolver {
  constructor(
    private participantsService: ParticipantsService,
    private trialsService: TrialsService,
    private enrollmentUseCase: EnrollmentUseCase,
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
    @Args('trialId') trialId: number,
    @Args('hadCovid') hadCovid: boolean,
    @Args('hasDiabetes') hasDiabetes: boolean,
    @Args('weight') weight: number,
    @Args('height') height: number,
    @Args('name') name: string,
  ) {
    const enrollmentResult = await this.enrollmentUseCase.enrollParticipant({
        name,
        height,
        weight,
        hasDiabetes,
        hadCovid,
        trialId,
      });
  
      return {
        participant: enrollmentResult.participant,
        isEligible: enrollmentResult.isEligible,
        ineligibilityReasons: enrollmentResult.ineligibilityReasons,
      };
  }

  @ResolveField('trial')
  async getTrial(@Parent() participant: Participant) {
    return this.trialsService.getTrial(participant.trialId, false);
  }
}
