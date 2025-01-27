import { Test, TestingModule } from '@nestjs/testing';
import { TrialsResolver } from './trials.resolver';
import { TrialsService } from '../services/trials.service';
import { GraphQLResolveInfo } from 'graphql';

describe('TrialsResolver', () => {
  let resolver: TrialsResolver;
  let trialsService: jest.Mocked<TrialsService>;

  // Mock data
  const mockTrials = [
    { id: 1, name: 'Trial 1' },
    { id: 2, name: 'Trial 2' },
  ];

  const mockTrialsWithCounts = [
    { id: 1, name: 'Trial 1', _count: { participants: 5 } },
    { id: 2, name: 'Trial 2', _count: { participants: 3 } },
  ];

  beforeEach(async () => {
    const mockTrialsService = {
      getTrials: jest.fn(),
      getTrialsWithParticipantCounts: jest.fn(),
      getTrial: jest.fn(),
      getParticipantsByTrialId: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TrialsResolver,
        {
          provide: TrialsService,
          useValue: mockTrialsService,
        },
      ],
    }).compile();

    resolver = module.get<TrialsResolver>(TrialsResolver);
    trialsService = module.get(TrialsService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('getTrials', () => {
    it('should return trials without participant count when not requested', async () => {
      const mockInfo = {
        fieldNodes: [
          {
            selectionSet: {
              selections: [
                { kind: 'Field', name: { value: 'id' } },
                { kind: 'Field', name: { value: 'name' } },
              ],
            },
          },
        ],
      } as unknown as GraphQLResolveInfo;

      trialsService.getTrials.mockResolvedValue(mockTrials);

      const result = await resolver.getTrials(mockInfo);
      expect(result).toEqual(mockTrials);
      expect(trialsService.getTrials).toHaveBeenCalled();
      expect(
        trialsService.getTrialsWithParticipantCounts,
      ).not.toHaveBeenCalled();
    });

    it('should return trials with participant count when requested', async () => {
      const mockInfo = {
        fieldNodes: [
          {
            selectionSet: {
              selections: [
                { kind: 'Field', name: { value: 'id' } },
                { kind: 'Field', name: { value: 'participantCount' } },
              ],
            },
          },
        ],
      } as unknown as GraphQLResolveInfo;

      trialsService.getTrialsWithParticipantCounts.mockResolvedValue(
        mockTrialsWithCounts,
      );

      const result = await resolver.getTrials(mockInfo);
      expect(result).toEqual([
        { id: 1, name: 'Trial 1', participantCount: 5 },
        { id: 2, name: 'Trial 2', participantCount: 3 },
      ]);
      expect(trialsService.getTrialsWithParticipantCounts).toHaveBeenCalled();
    });
  });

  describe('getTrial', () => {
    it('should return a single trial without participants when not requested', async () => {
      const mockInfo = {
        fieldNodes: [
          {
            selectionSet: {
              selections: [
                { kind: 'Field', name: { value: 'id' } },
                { kind: 'Field', name: { value: 'name' } },
              ],
            },
          },
        ],
      } as unknown as GraphQLResolveInfo;

      const mockTrial = { id: 1, name: 'Trial 1' };
      trialsService.getTrial.mockResolvedValue(mockTrial as any);

      const result = await resolver.getTrial(1, mockInfo);
      expect(result).toEqual(mockTrial);
      expect(trialsService.getTrial).toHaveBeenCalledWith(1, false);
    });

    it('should return a single trial with participants when requested', async () => {
      const mockInfo = {
        fieldNodes: [
          {
            selectionSet: {
              selections: [
                { kind: 'Field', name: { value: 'id' } },
                { kind: 'Field', name: { value: 'participants' } },
              ],
            },
          },
        ],
      } as unknown as GraphQLResolveInfo;

      const mockTrial = { id: 1, name: 'Trial 1', participants: [] };
      trialsService.getTrial.mockResolvedValue(mockTrial);

      const result = await resolver.getTrial(1, mockInfo);
      expect(result).toEqual(mockTrial);
      expect(trialsService.getTrial).toHaveBeenCalledWith(1, true);
    });
  });

  describe('getParticipants', () => {
    it('should return existing participants if already loaded', async () => {
      const mockTrial = {
        id: 1,
        participants: [{ id: 1, name: 'Participant 1' }],
      };

      const result = await resolver.getParticipants(mockTrial as any);
      expect(result).toEqual(mockTrial.participants);
      expect(trialsService.getParticipantsByTrialId).not.toHaveBeenCalled();
    });

    it('should fetch participants if not already loaded', async () => {
      const mockTrial = { id: 1 };
      const mockParticipants = [{ id: 1, name: 'Participant 1' }];

      trialsService.getParticipantsByTrialId.mockResolvedValue(
        mockParticipants as any,
      );

      const result = await resolver.getParticipants(mockTrial as any);
      expect(result).toEqual(mockParticipants);
      expect(trialsService.getParticipantsByTrialId).toHaveBeenCalledWith(1);
    });
  });
});
