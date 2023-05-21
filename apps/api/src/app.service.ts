import { Inject, Injectable, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AppService implements OnApplicationBootstrap {
  constructor(
    @Inject('POST_SERVICE') private readonly postClient: ClientProxy,
    @Inject('AUTHOR_SERVICE') private readonly authorClient: ClientProxy,
  ) {}

  async onApplicationBootstrap() {
    await this.postClient.connect();
    await this.authorClient.connect();
  }

  async getHello(): Promise<string> {
    return (
      await Promise.all([
        firstValueFrom(this.postClient.send<string>({ cmd: 'hello-post' }, 'seoco')),
        firstValueFrom(this.authorClient.send<string>({ cmd: 'hello-author' }, 'seoco')),
      ])
    ).join(', ');
  }
}
