import {
  Resolver,
  Query,
  Parent,
  ResolveField,
  Args,
  Info,
} from '@nestjs/graphql';
import { TrialsService } from '../services/trials.service';
import { Trial } from 'src/graphql';
import { GraphQLResolveInfo } from 'graphql';

@Resolver('Trial')
export class TrialsResolver {
  constructor(private trialsService: TrialsService) {}

  @Query('trials')
  async getTrials(@Info() info: GraphQLResolveInfo) {
    const requestedFields = this.getRequestedFields(info);
    const needsCount = requestedFields.includes('participantCount');

    if (!needsCount) {
      return this.trialsService.getTrials();
    }

    const trials = await this.trialsService.getTrialsWithParticipantCounts();

    return trials.map((trial) => ({
      id: trial.id,
      name: trial.name,
      participantCount: trial._count.participants,
    }));
  }

  private getRequestedFields(info: GraphQLResolveInfo): string[] {
    const selections = info.fieldNodes[0].selectionSet?.selections || [];
    return selections
      .filter(
        (selection): selection is import('graphql').FieldNode =>
          selection.kind === 'Field',
      )
      .map((field) => field.name.value);
  }

  @Query('trial')
  async getTrial(@Args('id') id: number, @Info() info: GraphQLResolveInfo) {
    const requestedFields = this.getRequestedFields(info);
    const needsParticipants = requestedFields.includes('participants');
    const trial = await this.trialsService.getTrial(id, needsParticipants);
    return trial;
  }

  @ResolveField('participants')
  async getParticipants(@Parent() trial: Trial) {
    if (trial.participants) {
      return trial.participants;
    }
    return this.trialsService.getParticipantsByTrialId(trial.id);
  }
}
