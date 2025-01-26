import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { PrismaService } from '../src/common/prisma.service';

describe('Trials (e2e)', () => {
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

  it('should fetch all trials without participants', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            trials {
              id
              name
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.trials).toBeDefined();
        expect(Array.isArray(res.body.data.trials)).toBeTruthy();
      });
  });

  it('should fetch all trials with participants', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            trials {
              id
              name
              participants {
                id
                name
                height
                weight
                hasDiabetes
                hadCovid
              }
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.trials).toBeDefined();
        expect(Array.isArray(res.body.data.trials)).toBeTruthy();
        expect(Array.isArray(res.body.data.trials[0]?.participants)).toBeTruthy();
      });
  });

  it('should fetch all trials with participantCount', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            trials {
              id
              name
              participantCount
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.trials).toBeDefined();
        expect(Array.isArray(res.body.data.trials)).toBeTruthy();
        expect(typeof res.body.data.trials[0]?.participantCount).toBe('number');
      });
  });

  it('should fetch trial by id', () => {
    return request(app.getHttpServer())
      .post('/graphql')
      .send({
        query: `
          query {
            trial(id: 1) {
              id
              name
              participants {
                name
              }
            }
          }
        `
      })
      .expect(200)
      .expect(res => {
        expect(res.body.data.trial).toBeDefined();
        expect(res.body.data.trial.id).toBe(1);
        expect(Array.isArray(res.body.data.trial.participants)).toBeTruthy();
      });
  });
});
