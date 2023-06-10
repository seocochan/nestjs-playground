import { Injectable } from '@nestjs/common';
import { Author } from '@graphql/__generated__/typings';

@Injectable()
export class AuthorService {
  getById(id: string): Author {
    return [
      { id: '1', name: 'foo' },
      { id: '2', name: 'bar' },
    ].find(it => it.id === id);
  }
}
