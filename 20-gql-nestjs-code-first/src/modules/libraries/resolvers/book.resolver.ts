import {Args, Mutation, Parent, Query, ResolveField, Resolver} from '@nestjs/graphql';
import { Book } from '../gql-types/book.gql-type';
import { Author } from '../gql-types/author.gql-type';
import { AuthorModelDataModel, authors, BookModelDataModel } from '../../../mocks/data.mocks';
import { books } from '../../../mocks/data.mocks';
import { BookGqlMutationArgsType } from '../gql-types/book.gql-mutation-args-type';

@Resolver(() => Book)
export class BookResolver {

  @Query(() => [Book])
  books(
    @Args('id', { nullable: true }) bookId: string
  ): BookModelDataModel[] {
    if (bookId) {
      return [books.find(book => book.id === bookId)];
    }
    return books;
  }

  @ResolveField(() => Author)
  author(
    @Parent() book: BookModelDataModel
  ): AuthorModelDataModel {
    return authors.find(author => book.author_id === author.id);
  }

  @Mutation(() => Book, {nullable: true})
  changeName(
    @Args() mutationArgs: BookGqlMutationArgsType
  ): BookModelDataModel {
    const oldBook = books.find(book => book.title === mutationArgs.oldTitle)
    if(oldBook){
      oldBook.title = mutationArgs.newTitle;
      return oldBook;
    }

    return null;
  }
}
