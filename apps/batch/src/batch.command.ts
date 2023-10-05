import { Command, CommandRunner } from 'nest-commander';
import { BatchService } from './batch.service';

@Command({ name: 'batch' })
export class BatchCommand extends CommandRunner {
  constructor(private readonly service: BatchService) {
    super();
  }
  async run() {
    console.log(this.service.getHello());
  }
}
