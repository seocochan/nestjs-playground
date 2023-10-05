import { BatchModule } from './batch.module';
import { CommandFactory } from 'nest-commander';

async function bootstrap() {
  await CommandFactory.run(BatchModule, ['warn', 'error']);
}
bootstrap();
