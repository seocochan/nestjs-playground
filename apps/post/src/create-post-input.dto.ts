import { IsNumberString, Length } from 'class-validator';
import { CreatePostInput } from '@graphql/__generated__/typings';

export class CreatePostInputDto extends CreatePostInput {
  @Length(1)
  title!: string;

  @Length(1)
  body!: string;

  @IsNumberString()
  authorId!: string;
}
