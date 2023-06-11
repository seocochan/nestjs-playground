import { Controller } from '@nestjs/common';
import {
  Author,
  AuthorById,
  AuthorServiceController,
  AuthorServiceControllerMethods,
} from '@proto/__generated__/proto/author';
import { Observable } from 'rxjs';
import { AuthorService } from './author.service';

@Controller()
@AuthorServiceControllerMethods()
export class AuthorController implements AuthorServiceController {
  constructor(private readonly authorService: AuthorService) {}

  findOne(data: AuthorById): Promise<Author> | Observable<Author> | Author {
    return this.authorService.getById(data.id);
  }
}
