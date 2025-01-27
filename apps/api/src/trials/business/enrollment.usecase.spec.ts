import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentUseCase } from './enrollment.usecase';
import { ParticipantsService } from '../services/participants.service';
import { TrialsService } from '../services/trials.service';
import { NotFoundException } from '@nestjs/common';

describe('EnrollmentUseCase', () => {
  let enrollmentUseCase: EnrollmentUseCase;
  let participantsService: jest.Mocked<ParticipantsService>;
  let trialsService: jest.Mocked<TrialsService>;

  beforeEach(async () => {
    // Create mock services
    const mockParticipantsService = {
      createParticipant: jest.fn(),
    };

    const mockTrialsService = {
      getTrial: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentUseCase,
        {
          provide: ParticipantsService,
          useValue: mockParticipantsService,
        },
        {
          provide: TrialsService,
          useValue: mockTrialsService,
        },
      ],
    }).compile();

    enrollmentUseCase = module.get<EnrollmentUseCase>(EnrollmentUseCase);
    participantsService = module.get(ParticipantsService);
    trialsService = module.get(TrialsService);
  });

  const validParticipantData = {
    name: 'John Doe',
    height: 70, // 5'10"
    weight: 170, // BMI ≈ 24.4
    hasDiabetes: true,
    hadCovid: false,
    trialId: 1,
  };

  describe('enrollParticipant', () => {
    it('should successfully enroll an eligible participant', async () => {
      // Arrange
      trialsService.getTrial.mockResolvedValue({ id: 1, name: 'Test Trial', participants: [] });
      participantsService.createParticipant.mockResolvedValue({
        id: 1,
        ...validParticipantData,
        enrolledAt: new Date(),
      });

      // Act
      const result = await enrollmentUseCase.enrollParticipant(validParticipantData);

      // Assert
      expect(result.isEligible).toBe(true);
      expect(result.ineligibilityReasons).toEqual([]);
      expect(result.participant).toBeDefined();
      expect(trialsService.getTrial).toHaveBeenCalledWith(validParticipantData.trialId, false);
      expect(participantsService.createParticipant).toHaveBeenCalledWith(validParticipantData);
    });

    it('should throw NotFoundException when trial is not found', async () => {
      // Arrange
      trialsService.getTrial.mockResolvedValue(null);

      // Act & Assert
      await expect(enrollmentUseCase.enrollParticipant(validParticipantData))
        .rejects
        .toThrow(NotFoundException);
    });

    it('should mark as ineligible due to low BMI', async () => {
      // Arrange
      const lowBmiData = {
        ...validParticipantData,
        weight: 120, // BMI ≈ 17.2 (too low)
      };
      trialsService.getTrial.mockResolvedValue({ id: 1, name: 'Test Trial', participants: [] });
      participantsService.createParticipant.mockResolvedValue({
        id: 1,
        ...lowBmiData,
        enrolledAt: new Date(),
      });

      // Act
      const result = await enrollmentUseCase.enrollParticipant(lowBmiData);

      // Assert
      expect(result.isEligible).toBe(false);
      expect(result.ineligibilityReasons).toContain('BMI (17.2) is too low - must be above 18');
    });

    it('should mark as ineligible due to having had COVID', async () => {
      // Arrange
      const hadCovidData = {
        ...validParticipantData,
        hadCovid: true,
      };
      trialsService.getTrial.mockResolvedValue({ id: 1, name: 'Test Trial', participants: [] });
      participantsService.createParticipant.mockResolvedValue({
        id: 1,
        ...hadCovidData,
        enrolledAt: new Date(),
      });

      // Act
      const result = await enrollmentUseCase.enrollParticipant(hadCovidData);

      // Assert
      expect(result.isEligible).toBe(false);
      expect(result.ineligibilityReasons).toContain('Participant has had COVID');
    });

    it('should mark as ineligible due to not having diabetes', async () => {
      // Arrange
      const noDiabetesData = {
        ...validParticipantData,
        hasDiabetes: false,
      };
      trialsService.getTrial.mockResolvedValue({ id: 1, name: 'Test Trial', participants: [] });
      participantsService.createParticipant.mockResolvedValue({
        id: 1,
        ...noDiabetesData,
        enrolledAt: new Date(),
      });

      // Act
      const result = await enrollmentUseCase.enrollParticipant(noDiabetesData);

      // Assert
      expect(result.isEligible).toBe(false);
      expect(result.ineligibilityReasons).toContain('Participant does not have diabetes');
    });

    it('should mark as ineligible due to high BMI', async () => {
      // Arrange
      const highBmiData = {
        ...validParticipantData,
        weight: 250, // BMI ≈ 35.9 (too high)
      };
      trialsService.getTrial.mockResolvedValue({ id: 1, name: 'Test Trial', participants: [] });
      participantsService.createParticipant.mockResolvedValue({
        id: 1,
        ...highBmiData,
        enrolledAt: new Date(),
      });

      // Act
      const result = await enrollmentUseCase.enrollParticipant(highBmiData);

      // Assert
      expect(result.isEligible).toBe(false);
      expect(result.ineligibilityReasons).toContain('BMI (35.9) is too high - must be below 30');
    });
  });
}); 