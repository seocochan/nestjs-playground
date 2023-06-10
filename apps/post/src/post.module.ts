import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: ['**/post.graphql'],
    }),
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
