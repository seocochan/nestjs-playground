import * as process from 'process';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';
import { AuthorController } from './author.controller';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: [join(process.cwd(), 'graphql/author.graphql')],
    }),
  ],
  controllers: [AuthorController],
  providers: [AuthorResolver, AuthorService],
})
export class AuthorModule {}
