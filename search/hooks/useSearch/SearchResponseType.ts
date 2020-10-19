import React from 'react';

import { Search_counts_counts } from '../../../../deps-api/graphql/__generated__/types';
import { ISearchItem } from '../../types';

export type SearchResponse = {
  total: number;
  items: ISearchItem[];
  counts: Search_counts_counts;
};

export type NestedSearchResponse = {
  id: string;
  items: React.ReactNode[];
};
