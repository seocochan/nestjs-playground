import * as process from 'process';
import { join } from 'path';
import { Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { PostResolver } from './post.resolver';
import { PostService } from './post.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { AUTHOR_PACKAGE_NAME } from '@proto/__generated__/proto/author';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      typePaths: [join(process.cwd(), 'graphql/post.graphql')],
    }),
    ClientsModule.register([
      {
        transport: Transport.GRPC,
        name: AUTHOR_PACKAGE_NAME,
        options: {
          package: AUTHOR_PACKAGE_NAME,
          protoPath: join(process.cwd(), 'proto/author.proto'),
        },
      },
    ]),
  ],
  providers: [PostResolver, PostService],
})
export class PostModule {}
