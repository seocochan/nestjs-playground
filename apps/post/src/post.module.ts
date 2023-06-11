import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: [join(__dirname, 'post.graphql')],
    }),
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
