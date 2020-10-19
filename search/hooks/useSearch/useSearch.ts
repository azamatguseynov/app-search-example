import { mergeDeepRight } from 'ramda';
import { useCallback, useReducer } from 'react';

import { SearchVariables } from '../../../../deps-api/graphql/__generated__/types';
import { ErrorNotification } from '../../../../utils/errorNotification';
import { TSearchFilters } from '../../types';

import {
  filterVariablesBySearchItemType,
  normalizeNestedSearchResponse,
  normalizeSearchResponse,
  useSafeDispatch,
} from './helpers';
import { nestedSearchRequest, searchRequest } from './searchService';
import {
  ClearAction,
  FetchMoreFailedAction,
  FetchMoreNestedSuccessAction,
  FetchMoreStartAction,
  FetchMoreSuccessAction,
  FilterFailedAction,
  FilterStartAction,
  FilterSuccessAction,
  initialSearchVariables,
  initialUseSearchState,
  SearchFailedAction,
  SearchStartAction,
  SearchSuccessAction,
  useSearchReducer,
  UseSearchState,
} from './useSearchReducer';

export type UseSearchVariables = Pick<SearchVariables, 'query' | 'searchItemType'> & TSearchFilters;
export type UseSearchFiltersVariables = Pick<SearchVariables, 'searchItemType'> & TSearchFilters;

export type UseSearch = {
  onSearch: (filters: UseSearchVariables) => void;
  onFilter: (filters: UseSearchFiltersVariables) => void;
  onFetchMore: () => void;
  onFetchMoreNested: (id: string, takeVariable: number, skipVariable: number) => Promise<void>;
  onClear: () => void;
  state: UseSearchState;
};

export const useSearch = (initialVariables: UseSearchVariables): UseSearch => {
  const [state, dispatch] = useReducer(useSearchReducer, {
    ...initialUseSearchState,
    variables: {
      ...initialSearchVariables,
      ...initialVariables,
    },
  });
  const { variables: stateVariables, items } = state;
  const safeDispatch = useSafeDispatch(dispatch);

  const onSearch = useCallback(
    (variables: UseSearchVariables) => {
      const searchVariables = mergeDeepRight(initialSearchVariables, variables);

      safeDispatch(SearchStartAction(searchVariables));

      searchRequest(searchVariables)
        .then(normalizeSearchResponse)
        .then(normalizedResponse => safeDispatch(SearchSuccessAction(normalizedResponse)))
        .catch(e => {
          safeDispatch(SearchFailedAction());
          ErrorNotification.open({ message: 'Не удалось выполнить поисковый запрос' }, e);
        });
    },
    [safeDispatch],
  );

  const onFilter = useCallback(
    (variables: UseSearchFiltersVariables) => {
      const mergedVariables = mergeDeepRight(stateVariables, variables);

      safeDispatch(FilterStartAction(mergedVariables));

      const searchVariables = filterVariablesBySearchItemType(mergedVariables);

      searchRequest(searchVariables)
        .then(normalizeSearchResponse)
        .then(normalizedResponse => safeDispatch(FilterSuccessAction(normalizedResponse)))
        .catch(e => {
          safeDispatch(FilterFailedAction());
          ErrorNotification.open({ message: 'Не удалось выполнить поисковый запрос' }, e);
        });
    },
    [safeDispatch, stateVariables],
  );

  const onFetchMore = useCallback(() => {
    safeDispatch(FetchMoreStartAction());

    const searchVariables = filterVariablesBySearchItemType(stateVariables);

    searchRequest({ ...searchVariables, skip: items.length })
      .then(normalizeSearchResponse)
      .then(normalizedResponse => safeDispatch(FetchMoreSuccessAction(normalizedResponse)))
      .catch(e => {
        safeDispatch(FetchMoreFailedAction());
        ErrorNotification.open({ message: 'Не удалось загрузить данные' }, e);
      });
  }, [stateVariables, items, safeDispatch]);

  const onFetchMoreNested = useCallback(
    (searchItemId, nestedTake, nestedSkip) =>
      nestedSearchRequest({ query: stateVariables.query, id: searchItemId, nestedSkip, nestedTake })
        .then(normalizeNestedSearchResponse)
        .then(normalizedResponse => safeDispatch(FetchMoreNestedSuccessAction(normalizedResponse)))
        .catch(e => ErrorNotification.open({ message: 'Не удалось загрузить данные' }, e)),
    [stateVariables, safeDispatch],
  );

  const onClear = useCallback(() => {
    safeDispatch(ClearAction());
  }, [safeDispatch]);

  return {
    onSearch,
    onFilter,
    onFetchMore,
    onClear,
    state,
    onFetchMoreNested,
  };
};
