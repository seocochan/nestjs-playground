import { Injectable } from '@nestjs/common';
import { Post } from '@graphql/__generated__/typings';

@Injectable()
export class PostService {
  getAll(): Post[] {
    return [
      { id: '1', title: 'one', body: 'one...', authorId: '1' },
      { id: '2', title: 'two', body: 'two...', authorId: '2' },
    ];
  }
}
