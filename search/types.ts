import React from 'react';

import { ESearchItemType, Search_counts_counts, SearchVariables } from '../../deps-api/graphql/__generated__/types';

export type SearchCounts = Omit<Search_counts_counts, '__typename'>;

export type TSearchFilters = Omit<SearchVariables, 'skip' | 'take' | 'query' | 'searchItemType'>;

export type SearchResultItemPath = {
  name: string;
  link?: string;
  icon?: React.ReactNode;
};

export interface ISearchItem {
  id: string;
  type: ESearchItemType;
  icon?: React.ReactNode;
  title: React.ReactNode;
  link?: string;
  path: SearchResultItemPath[];
  description?: React.ReactNode[];
  actions?: React.ReactNode[];
  childrenList: React.ReactNode[];
  childrenTotal?: number | null;
}

export enum ESearchType {
  All = 'all',
  Subscriptions = 'subscriptions',
  StockElements = 'stockElements',
}

export type SearchTypeRecord<T> = Record<ESearchType, T>;
