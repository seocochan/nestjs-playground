import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { AuthorService } from './author.service';

@Controller()
export class AuthorController {
  constructor(private readonly authorService: AuthorService) {}

  @MessagePattern({ cmd: 'hello-author' })
  getHello(name: string): string {
    return this.authorService.getHello(name);
  }
}
