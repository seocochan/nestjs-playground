/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { GrpcMethod, GrpcStreamMethod } from "@nestjs/microservices";
import { Observable } from "rxjs";

export const protobufPackage = "author";

export interface AuthorById {
  id: string;
}

export interface Author {
  id: string;
  name: string;
}

export const AUTHOR_PACKAGE_NAME = "author";

export interface AuthorServiceClient {
  findOne(request: AuthorById, metadata?: Metadata): Observable<Author>;
}

export interface AuthorServiceController {
  findOne(request: AuthorById, metadata?: Metadata): Promise<Author> | Observable<Author> | Author;
}

export function AuthorServiceControllerMethods() {
  return function (constructor: Function) {
    const grpcMethods: string[] = ["findOne"];
    for (const method of grpcMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcMethod("AuthorService", method)(constructor.prototype[method], method, descriptor);
    }
    const grpcStreamMethods: string[] = [];
    for (const method of grpcStreamMethods) {
      const descriptor: any = Reflect.getOwnPropertyDescriptor(constructor.prototype, method);
      GrpcStreamMethod("AuthorService", method)(constructor.prototype[method], method, descriptor);
    }
  };
}

export const AUTHOR_SERVICE_NAME = "AuthorService";
