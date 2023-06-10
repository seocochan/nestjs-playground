import { GraphQLFederationDefinitionsFactory } from '@nestjs/graphql';
import { join } from 'path';

/**
 * @see {@link https://stackoverflow.com/a/72314336}
 */
const definitionsFactory = new GraphQLFederationDefinitionsFactory();
definitionsFactory.generate({
  typePaths: ['**/*.graphql'],
  path: join(process.cwd(), 'graphql/__generated__/typings.ts'),
  outputAs: 'class',
  watch: true,
});
