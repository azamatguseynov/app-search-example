import { flatten } from 'ramda';
import { useCallback } from 'react';

import { useLastQueryParams } from '../../../components/LastQueryParamsProvider';
import { useQueryParams } from '../../../components/withQueryParams';
import { ESearchItemType, ESubscriptionStatus, SearchVariables } from '../../../deps-api/graphql/__generated__/types';

import { filterKeyBySearchItemType } from './useSearch/helpers';

export type SearchPageQueryParams = {
  query?: string;
  type?: ESearchItemType;
  status?: ESubscriptionStatus | ESubscriptionStatus[];
};

const getVariablesFromQueryParams = (params: SearchPageQueryParams): SearchVariables => {
  const { query = '', type: searchItemType, status } = params;

  const filters = {
    ...(status && { subscriptionFilters: { status: flatten([status]) } }),
  };

  return {
    query,
    searchItemType,
    ...filters,
  };
};

export const useSearchQueryParams = () => {
  const { lastQueryParams, setLastQueryParams } = useLastQueryParams<SearchPageQueryParams>();
  const { params, setQueryParams } = useQueryParams<SearchPageQueryParams>();
  const hasQueryParams = Boolean(params) && Boolean(Object.keys(params).length);
  const saveAndSetQueryParams = useCallback(
    (queryParams: SearchPageQueryParams) => {
      setLastQueryParams(queryParams);
      setQueryParams(queryParams);
    },
    [setLastQueryParams, setQueryParams],
  );

  const setSearchQueryParams = useCallback(
    (searchVariables: SearchVariables) => {
      const { query, searchItemType } = searchVariables;

      if (!searchItemType) {
        return saveAndSetQueryParams({ query });
      }

      const currentFiltersKey = filterKeyBySearchItemType[searchItemType];
      const filters = currentFiltersKey ? searchVariables[currentFiltersKey] : {};

      saveAndSetQueryParams({
        query,
        type: searchItemType,
        ...filters,
      });
    },
    [saveAndSetQueryParams],
  );

  const variables = getVariablesFromQueryParams(hasQueryParams ? params : lastQueryParams || {});

  return {
    variables,
    setSearchQueryParams,
  };
};
