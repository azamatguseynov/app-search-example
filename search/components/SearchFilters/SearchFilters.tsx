import { CheckboxValueType } from '@react-kit/components/Checkbox';
import React, { ComponentType } from 'react';

import { TSearchFilters } from '../../types';

import styles from './SearchFilters.module.less';

export type SearchFilterComponentType = ComponentType<SearchFilterTypeProps>;

export type FilterValue = string | string[] | number | number[] | CheckboxValueType[] | any; // FIXME

type FilterRenderType = {
  value: FilterValue;
  component: SearchFilterComponentType;
};

export type SearchFilterTypeProps<T = FilterValue> = {
  onFilter: (filters: TSearchFilters) => void;
  value: T;
  className?: string;
};

type Props = {
  filters: FilterRenderType[];
  onFilter: (filters: TSearchFilters) => void;
};

export const SearchFilters: React.FC<Props> = ({ filters, onFilter }) => (
  <div className={styles.searchFilters}>
    {filters.map(({ component: FilterComponent, value }, index) => (
      <FilterComponent key={index} className={styles.filterItem} onFilter={onFilter} value={value} />
    ))}
  </div>
);
