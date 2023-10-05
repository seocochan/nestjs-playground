import { Module } from '@nestjs/common';
import { BatchService } from './batch.service';
import { BatchCommand } from './batch.command';

@Module({
  providers: [BatchCommand, BatchService],
})
export class BatchModule {}
