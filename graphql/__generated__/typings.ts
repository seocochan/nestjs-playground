
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class Author {
    id: string;
    name: string;
    posts?: Nullable<Nullable<Post>[]>;
}

export abstract class IQuery {
    abstract getAuthor(id: string): Nullable<Author> | Promise<Nullable<Author>>;

    abstract getPosts(): Nullable<Nullable<Post>[]> | Promise<Nullable<Nullable<Post>[]>>;

    abstract getPost(): Post | Promise<Post>;
}

export class Post {
    id: string;
    title: string;
    body: string;
    authorId?: Nullable<string>;
    author?: Nullable<Author>;
}

type Nullable<T> = T | null;
