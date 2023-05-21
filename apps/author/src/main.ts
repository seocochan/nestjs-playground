import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { AuthorModule } from './author.module';

async function bootstrap() {
  const app = await NestFactory.createMicroservice(AuthorModule, {
    transport: Transport.TCP,
    options: {
      port: 3002,
    },
  });
  await app.listen();
}
bootstrap();
