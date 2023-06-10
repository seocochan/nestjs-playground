import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloGatewayDriver, ApolloGatewayDriverConfig } from '@nestjs/apollo';
import { IntrospectAndCompose } from '@apollo/gateway';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloGatewayDriverConfig>({
      driver: ApolloGatewayDriver,
      gateway: {
        supergraphSdl: new IntrospectAndCompose({
          subgraphs: [
            { name: 'Post', url: 'http://localhost:3001/graphql' },
            { name: 'Author', url: 'http://localhost:3002/graphql' },
          ],
        }),
      },
    }),
    // ClientsModule.register([
    //   { name: 'POST_SERVICE', transport: Transport.GRPC, options: {} },
    //   { name: 'AUTHOR_SERVICE', transport: Transport.GRPC, options: {} },
    // ]),
  ],
  // controllers: [AppController],
  // providers: [AppService],
})
export class AppModule {}
