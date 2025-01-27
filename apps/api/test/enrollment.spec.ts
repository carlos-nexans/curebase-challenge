import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma.service';

describe('Enrollment (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;
  let testTrialId: number;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();

    // Create a test trial for our enrollment tests
    const createTrialResponse = await request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createTrial(name: "Test Trial") {
              id
            }
          }
        `,
      });
    testTrialId = createTrialResponse.body.data.createTrial.id;
  });

  afterEach(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('should successfully enroll an eligible participant', () => {
    // Height: 70 inches (5'10"), Weight: 170 lbs => BMI ≈ 24.4 (within range)
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createParticipant(
              name: "John Doe"
              height: 70
              weight: 170
              hasDiabetes: true
              hadCovid: false
              trialId: ${testTrialId}
            ) {
              isEligible
              ineligibilityReasons
              participant {
                id
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createParticipant).toBeDefined();
        expect(res.body.data.createParticipant.isEligible).toBe(true);
        expect(res.body.data.createParticipant.ineligibilityReasons).toEqual([]);
        expect(res.body.data.createParticipant.participant.id).toBeDefined();
      });
  });

  it('should mark as ineligible due to low BMI', () => {
    // Height: 70 inches (5'10"), Weight: 120 lbs => BMI ≈ 17.2 (too low)
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createParticipant(
              name: "Jane Doe"
              height: 70
              weight: 120
              hasDiabetes: true
              hadCovid: false
              trialId: ${testTrialId}
            ) {
              isEligible
              ineligibilityReasons
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createParticipant).toBeDefined();
        expect(res.body.data.createParticipant.isEligible).toBe(false);
        expect(res.body.data.createParticipant.ineligibilityReasons).toContain('BMI (17.2) is too low - must be above 18');
      });
  });

  it('should mark as ineligible due to having had COVID', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createParticipant(
              name: "Bob Smith"
              height: 70
              weight: 170
              hasDiabetes: true
              hadCovid: true
              trialId: ${testTrialId}
            ) {
              isEligible
              ineligibilityReasons
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createParticipant).toBeDefined();
        expect(res.body.data.createParticipant.isEligible).toBe(false);
        expect(res.body.data.createParticipant.ineligibilityReasons).toContain('Participant has had COVID');
      });
  });

  it('should mark as ineligible due to not having diabetes', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createParticipant(
              name: "Alice Johnson"
              height: 70
              weight: 170
              hasDiabetes: false
              hadCovid: false
              trialId: ${testTrialId}
            ) {
              isEligible
              ineligibilityReasons
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.data.createParticipant).toBeDefined();
        expect(res.body.data.createParticipant.isEligible).toBe(false);
        expect(res.body.data.createParticipant.ineligibilityReasons).toContain('Participant does not have diabetes');
      });
  });

  it.only('should fail when trial is not found', () => {
    const nonExistentTrialId = 99999;
    
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          mutation {
            createParticipant(
              name: "John Doe"
              height: 70
              weight: 170
              hasDiabetes: true
              hadCovid: false
              trialId: ${nonExistentTrialId}
            ) {
              isEligible
              ineligibilityReasons
              participant {
                id
              }
            }
          }
        `,
      })
      .expect(200)
      .expect((res) => {
        expect(res.body.errors).toBeDefined();
        expect(res.body.errors[0].message).toBe('Trial not found');
      });
  });
});
