import { keys } from 'ramda';
import React, { ChangeEvent, KeyboardEvent, useCallback, useEffect, useState } from 'react';

import { ErrorBoundary } from '../../../../components/ErrorBoundary';
import { SearchInput } from '../../../../components/SearchInput';
import { withQueryParams } from '../../../../components/withQueryParams';
import { ESearchItemType } from '../../../../deps-api/graphql/__generated__/types';
import { useMountEffect } from '../../../../hooks/useMountEffect';
import { SearchEmpty } from '../../components/SearchEmpty';
import { SearchResultTabs } from '../../components/SearchResultTabs';
import { useSearch } from '../../hooks/useSearch';
import { useSearchQueryParams } from '../../hooks/useSearchQueryParams';
import { ESearchType, SearchTypeRecord } from '../../types';

import styles from './SearchPage.module.less';

const searchItemTypeBySearchType: SearchTypeRecord<ESearchItemType | null> = {
  [ESearchType.All]: null,
  [ESearchType.Subscriptions]: ESearchItemType.Subscription,
  [ESearchType.StockElements]: ESearchItemType.StockElement,
};

const getSearchTypeBySearchItemType = (type: ESearchItemType | null) => {
  return keys(searchItemTypeBySearchType).find(key => searchItemTypeBySearchType[key] === type);
};

const MIN_SEARCH_LENGTH = 3;
const isSearchQueryValid = (query?: string) => query && query.length >= MIN_SEARCH_LENGTH;

const SearchPage: React.FC = () => {
  const { variables: initialVariables, setSearchQueryParams } = useSearchQueryParams();
  const { onSearch, onFilter, onClear, onFetchMore, state, onFetchMoreNested } = useSearch(initialVariables);
  const { isSearching, isSearched, isSearchErrored, ...searchResultProps } = state;
  const { counts, variables } = searchResultProps;
  const { query, searchItemType } = variables;
  const [inputValue, setInputValue] = useState(query);
  const isSearchResultEmpty = !Boolean(counts.total);

  useMountEffect(() => {
    if (isSearchQueryValid(query)) {
      onSearch(variables);
    }
  });

  useEffect(() => {
    setSearchQueryParams(variables);
  }, [variables]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleTabsChange = useCallback(
    (tab?: string) => {
      const searchType = tab! as ESearchType;
      const selectedSearchItemType = searchItemTypeBySearchType[searchType];
      const isSearchItemTypeChanged = selectedSearchItemType !== searchItemType;

      if (isSearchItemTypeChanged) {
        onFilter({ searchItemType: selectedSearchItemType });
      }
    },
    [onFilter, searchItemType],
  );

  const handlePressEnter = useCallback(
    ({ currentTarget: { value } }: KeyboardEvent<HTMLInputElement>) => {
      const isSearchQueryChanged = value !== query;

      if (isSearchQueryValid(value) && isSearchQueryChanged) {
        onSearch({ query: value });
      }
    },
    [onSearch, query],
  );

  const handleInputValueChange = useCallback(
    ({ currentTarget: { value } }: ChangeEvent<HTMLInputElement>) => {
      setInputValue(value);
    },
    [setInputValue],
  );

  const renderSearchResult = isSearchResultEmpty ? (
    <SearchEmpty searchQuery={query} />
  ) : (
    <SearchResultTabs
      tab={getSearchTypeBySearchItemType(searchItemType!)}
      onNavigateToTab={handleTabsChange}
      onFilter={onFilter}
      onFetchMore={onFetchMore}
      onFetchMoreNested={onFetchMoreNested}
      {...searchResultProps}
    />
  );

  return (
    <div className={styles.searchPage}>
      <ErrorBoundary>
        <SearchInput
          className={styles.searchInput}
          onPressEnter={handlePressEnter}
          value={inputValue}
          onChange={handleInputValueChange}
          onClear={onClear}
          loading={isSearching}
        />
        {!isSearchErrored && !isSearching && isSearched && renderSearchResult}
      </ErrorBoundary>
    </div>
  );
};

export const SearchPageWithQueryParams = withQueryParams()(SearchPage);
