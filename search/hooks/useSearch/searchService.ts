import { ApolloQueryResult, QueryOptions } from 'apollo-client';
import uuid from 'uuid';

import { apolloClient } from '../../../../apollo';
import {
  PaginateNestedSearch,
  PaginateNestedSearchVariables,
  Search,
  SearchVariables,
} from '../../../../deps-api/graphql/__generated__/types';

import { paginateNestedSearchQuery, searchQuery } from './queries/searchQuery';

const searchRequestId = uuid();
const nestedSearchRequestId = uuid();

export const searchRequest = (variables: SearchVariables): Promise<Search> => {
  const queryVariables: QueryOptions<SearchVariables> = {
    query: searchQuery,
    variables,
    fetchPolicy: 'no-cache',
    context: {
      abortPreviousId: searchRequestId,
    },
  };

  return apolloClient.query<Search, SearchVariables>(queryVariables).then(handleError);
};

export const nestedSearchRequest = (variables: PaginateNestedSearchVariables): Promise<PaginateNestedSearch> => {
  const queryVariables: QueryOptions<PaginateNestedSearchVariables> = {
    query: paginateNestedSearchQuery,
    variables,
    fetchPolicy: 'no-cache',
    context: {
      abortPreviousId: nestedSearchRequestId,
    },
  };

  return apolloClient.query<PaginateNestedSearch, PaginateNestedSearchVariables>(queryVariables).then(handleError);
};

const handleError = <T>({ data, errors }: ApolloQueryResult<T>) => {
  if (errors && errors.length) {
    throw new Error('Не удалось выполнить запрос');
  }

  return data;
};
