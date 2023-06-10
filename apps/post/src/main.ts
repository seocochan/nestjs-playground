import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { PostModule } from './post.module';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  // app.connectMicroservice({
  //   transport: Transport.GRPC,
  // });
  // await app.startAllMicroservices();
  await app.listen(3001);
}
bootstrap();
