import { Inject, Injectable, NotFoundException, OnModuleInit } from '@nestjs/common';
import { ClientGrpc } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';
import { Post } from '@graphql/__generated__/typings';
import { AUTHOR_PACKAGE_NAME, AUTHOR_SERVICE_NAME, AuthorServiceClient } from '@proto/__generated__/proto/author';
import { CreatePostInputDto } from './create-post-input.dto';
import { PostEntity } from './post.entity';

@Injectable()
export class PostService implements OnModuleInit {
  private authorService: AuthorServiceClient;
  private posts: PostEntity[] = [
    { id: '1', title: 'one', body: 'one...', authorId: '1' },
    { id: '2', title: 'two', body: 'two...', authorId: '2' },
  ];

  constructor(@Inject(AUTHOR_PACKAGE_NAME) private client: ClientGrpc) {}

  onModuleInit() {
    this.authorService = this.client.getService(AUTHOR_SERVICE_NAME);
  }

  getAll(): Post[] {
    return this.posts;
  }

  async create(input: CreatePostInputDto): Promise<Post> {
    const author = await firstValueFrom(this.authorService.findOne({ id: input.authorId }));
    if (!author.id) {
      throw new NotFoundException(`Author not found by id of '${input.authorId}'`);
    }
    const post: PostEntity = { id: (this.posts.length + 1).toString(), ...input };
    this.posts.push(post);
    return post;
  }
}
