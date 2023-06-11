import { Injectable } from '@nestjs/common';
import { Author } from '@graphql/__generated__/typings';

@Injectable()
export class AuthorService {
  private authors: Author[] = [
    { id: '1', name: 'foo' },
    { id: '2', name: 'bar' },
  ];

  getById(id: string): Author {
    return this.authors.find(it => it.id === id);
  }
}
