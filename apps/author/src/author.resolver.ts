import { Args, Query, Resolver, ResolveReference } from '@nestjs/graphql';
import { AuthorService } from './author.service';

@Resolver('Author')
export class AuthorResolver {
  constructor(private authorService: AuthorService) {}

  @Query()
  getAuthor(@Args('id') id: string) {
    return this.authorService.getById(id);
  }

  @ResolveReference()
  resolveReference(reference: { __typename: string; id: string }) {
    return this.authorService.getById(reference.id);
  }
}
