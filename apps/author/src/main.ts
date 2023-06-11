import * as process from 'process';
import { join } from 'path';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { ValidationPipe } from '@nestjs/common';
import { AUTHOR_PACKAGE_NAME } from '@proto/__generated__/proto/author';
import { AuthorModule } from './author.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthorModule);
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.GRPC,
    options: {
      package: AUTHOR_PACKAGE_NAME,
      protoPath: join(process.cwd(), 'proto/author.proto'),
    },
  });

  app.useGlobalPipes(new ValidationPipe());

  await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
