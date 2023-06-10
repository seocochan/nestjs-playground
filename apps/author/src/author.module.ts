import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { AuthorResolver } from './author.resolver';
import { AuthorService } from './author.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['**/author.graphql'],
    }),
  ],
  providers: [AuthorResolver, AuthorService],
})
export class AuthorModule {}
