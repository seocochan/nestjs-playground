import { Query, Resolver, Parent, ResolveField, Mutation, Args } from '@nestjs/graphql';
import { PostService } from './post.service';
import { Post } from '@graphql/__generated__/typings';
import { CreatePostInputDto } from './create-post-input.dto';

@Resolver('Post')
export class PostResolver {
  constructor(private postService: PostService) {}

  @Query()
  getPosts() {
    return this.postService.getAll();
  }

  @Mutation()
  createPost(@Args('input') input: CreatePostInputDto) {
    return this.postService.create(input);
  }

  @ResolveField('author')
  getUser(@Parent() post: Post) {
    return { __typename: 'Author', id: post.authorId };
  }
}
