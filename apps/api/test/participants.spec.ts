import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma.service';

describe('Participants (e2e)', () => {
  let app: INestApplication;
  let prismaService: PrismaService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    prismaService = app.get<PrismaService>(PrismaService);
    await app.init();
  });

  afterEach(async () => {
    await prismaService.$disconnect();
    await app.close();
  });

  it('should fetch all participants', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            participants {
              id
              name
              height
              weight
              hasDiabetes
              hadCovid
              trialId
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.participants).toBeDefined();
        expect(Array.isArray(res.body.data.participants)).toBeTruthy();
      });
  });

  it('should fetch participant by id', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            participant(id: 1) {
              id
              name
              height
              weight
              hasDiabetes
              hadCovid
              trialId
              trial {
                id
                name
              }
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.participant).toBeDefined();
        expect(res.body.data.participant.id).toBe(1);
        expect(res.body.data.participant.trial).toBeDefined();
      });
  });

  it.only('should fetch participants with trial information', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            participants {
              id
              name
              trial {
                id
                name
              }
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.participants).toBeDefined();
        expect(Array.isArray(res.body.data.participants)).toBeTruthy();
        if (res.body.data.participants.length > 0) {
          expect(res.body.data.participants[0].trial).toBeDefined();
        }
      });
  });
});