import { Command, CommandRunner } from 'nest-commander';
import { BatchService } from './batch.service';

@Command({ name: 'batch', arguments: '<message>' })
export class BatchCommand extends CommandRunner {
  constructor(private readonly service: BatchService) {
    super();
  }
  async run(inputs: string[]) {
    const [message] = inputs
    console.log(this.service.getHello() + ' ' + message);
  }
}
