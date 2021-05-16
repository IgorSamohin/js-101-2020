import { ArgsType, Field } from '@nestjs/graphql';
import {Author} from "./author.gql-type";

@ArgsType()
export class BookGqlMutationArgsType {
  @Field()
  oldTitle: string;

  @Field()
  newTitle: string;
}