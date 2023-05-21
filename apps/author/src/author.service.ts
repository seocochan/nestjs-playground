import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthorService {
  getHello(name: string): string {
    return `It's author service. UwU ${name}~`;
  }
}
