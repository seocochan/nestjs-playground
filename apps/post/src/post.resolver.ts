import { Query, Resolver, Parent, ResolveField } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from '@graphql/__generated__/typings';

@Resolver('Post')
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query('getPosts')
  getPosts() {
    return this.postService.getAll();
  }

  @ResolveField('author')
  getUser(@Parent() post: Post) {
    return { __typename: 'Author', id: post.authorId };
  }
}
