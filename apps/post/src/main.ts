import { NestFactory } from '@nestjs/core';
import { PostModule } from './post.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(PostModule);
  app.useGlobalPipes(new ValidationPipe());

  await app.listen(3001);
}
bootstrap();
