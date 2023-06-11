import { Injectable } from '@nestjs/common';
import { Post } from '@graphql/__generated__/typings';
import { CreatePostInputDto } from './create-post-input.dto';

@Injectable()
export class PostService {
  private posts: Post[] = [
    { id: '1', title: 'one', body: 'one...', authorId: '1' },
    { id: '2', title: 'two', body: 'two...', authorId: '2' },
  ];

  getAll(): Post[] {
    return this.posts;
  }

  create(input: CreatePostInputDto): Post {
    const post: Post = { id: (this.posts.length + 1).toString(), ...input };
    this.posts.push(post);
    return post;
  }
}
