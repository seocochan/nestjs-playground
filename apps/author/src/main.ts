import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthorModule } from './author.module';

async function bootstrap() {
  const app = await NestFactory.create(AuthorModule);
  // app.connectMicroservice({
  //   transport: Transport.GRPC,
  // });
  // await app.startAllMicroservices();
  await app.listen(3002);
}
bootstrap();
