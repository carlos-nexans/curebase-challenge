import { join } from 'path';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { TrialsModule } from './trials/trials.module';
import { ConfigModule } from '@nestjs/config';
import { DateScalar } from './common/date.scalar';
import * as createDepthLimitRule from 'graphql-depth-limit';

@Module({
  providers: [DateScalar],
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      typePaths: ['./**/*.graphql'],
      definitions: {
        path: join(process.cwd(), 'src/graphql.ts'),
      },
      introspection: process.env.NODE_ENV !== 'production',
      playground: process.env.NODE_ENV !== 'production',
      validationRules: [createDepthLimitRule(2)],
    }),
    TrialsModule,
  ],
  controllers: [AppController],
})
export class AppModule {}
