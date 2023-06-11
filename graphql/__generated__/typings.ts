
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class CreatePostInput {
    title: string;
    body: string;
    authorId: string;
}

export class Author {
    id: string;
    name: string;
    posts?: Nullable<Post[]>;
}

export abstract class IQuery {
    abstract getAuthor(id: string): Author | Promise<Author>;

    abstract getPosts(): Post[] | Promise<Post[]>;

    abstract getPost(): Post | Promise<Post>;
}

export class Post {
    id: string;
    title: string;
    body: string;
    authorId?: Nullable<string>;
    author?: Nullable<Author>;
}

export abstract class IMutation {
    abstract createPost(input: CreatePostInput): Post | Promise<Post>;
}

type Nullable<T> = T | null;
