import { Injectable } from '@nestjs/common';

@Injectable()
export class PostService {
  getHello(name: string): string {
    return `It's post service. UwU ${name}~`;
  }
}
