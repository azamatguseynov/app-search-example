import { useDidUnmount } from '@react-kit/hooks/useDidUnmount';
import deepCleaner from 'deep-cleaner';
import { omit, pick, values } from 'ramda';
import { ReactNode, useCallback } from 'react';

import { Action } from '../../../../common/ActionType';
import {
  ESearchItemType,
  PaginateNestedSearch,
  Search,
  Search_search_items as SearchResponseItem,
  SearchVariables,
} from '../../../../deps-api/graphql/__generated__/types';
import { searchConfig } from '../../searchConfig';
import { ISearchItem, TSearchFilters } from '../../types';

import { NestedSearchResponse, SearchResponse } from './SearchResponseType';

export const filterKeyBySearchItemType: Record<ESearchItemType, keyof TSearchFilters | ''> = {
  [ESearchItemType.StockElement]: '',
  [ESearchItemType.Subscription]: 'subscriptionFilters',
};

export const filterVariablesBySearchItemType = (variables: SearchVariables): SearchVariables => {
  const { searchItemType } = variables;

  const filtersKeys = values(filterKeyBySearchItemType);
  const variablesWithoutFilters = omit(filtersKeys, variables);

  if (!searchItemType) {
    return variablesWithoutFilters;
  }

  const currentFiltersKey = filterKeyBySearchItemType[searchItemType];
  const filters = pick([currentFiltersKey], variables);

  const searchVariables = {
    ...variablesWithoutFilters,
    ...filters,
  };

  return deepCleaner(deepCleaner(searchVariables)); // TODO избавиться от deepCleaner.
};

export const useSafeDispatch = <T extends Action<any, any>>(dispatch: (action: T) => void) => {
  const didUnmount = useDidUnmount();

  return useCallback(
    (action: T) => {
      if (!didUnmount.current) {
        dispatch(action);
      }
    },
    [didUnmount, dispatch],
  );
};

export const normalizeSearchResponse = (searchResponse: Search): SearchResponse => {
  const {
    counts: { counts },
    search: { items: searchResponseItems, total },
  } = searchResponse;
  const items = searchResponseItems.map(getSearchItemFromResponse);

  return { items, total, counts };
};

export const normalizeNestedSearchResponse = (nestedSearchItems: PaginateNestedSearch): NestedSearchResponse => {
  const responseItems = nestedSearchItems.nestedSearchItems.items[0].pagination?.items ?? [];
  const id = nestedSearchItems.nestedSearchItems.items[0].id;
  const items = responseItems.map(getNestedSearchItemFromResponse);

  return { id, items };
};

const getSearchItemFromResponse = (response: SearchResponseItem): ISearchItem => {
  const { getSearchItem } = searchConfig[response.type];

  return getSearchItem(response);
};

const getNestedSearchItemFromResponse = <T extends object>(response: T): ReactNode => {
  const { getNestedSearchItem } = searchConfig[ESearchItemType.Subscription];

  return getNestedSearchItem!(response);
};
