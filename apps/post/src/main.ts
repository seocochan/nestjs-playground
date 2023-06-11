import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { PostModule } from './post.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  // app.connectMicroservice({
  //   transport: Transport.GRPC,
  // });
  // await app.startAllMicroservices();
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(3001);
}
bootstrap();
