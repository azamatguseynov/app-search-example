import { TTabList } from '@dsm/frontend-react-kit/src/components/Tabs/TabList';
import { Card } from '@react-kit/components/Card';
import { TabList, TabPane } from '@react-kit/components/Tabs';
import { keys } from 'ramda';
import React, { useCallback } from 'react';

import { selectPluralForm } from '../../../../utils/selectPluralForm';
import { UseSearch, UseSearchState } from '../../hooks/useSearch';
import { ESearchType, SearchCounts, SearchTypeRecord, TSearchFilters } from '../../types';
import { SearchFilters } from '../SearchFilters';
import { FilterValue, SearchFilterComponentType } from '../SearchFilters/SearchFilters';
import { SubscriptionTypeSearchFilter } from '../SubscriptionTypeSearchFilter';

import { SearchResultList, SearchResultListProps } from './SearchResultList';
import styles from './SearchResultTabs.module.less';

export type Props = Pick<UseSearch, 'onFilter' | 'onFetchMoreNested'> &
  Pick<UseSearchState, 'variables' | 'counts'> &
  Pick<TTabList, 'tab' | 'onNavigateToTab'> &
  Omit<SearchResultListProps, 'getTotalText'>;

type FilterRenderMethods = {
  getValue: (filters: TSearchFilters) => FilterValue;
  component: SearchFilterComponentType;
};

type SearchTabSetting = {
  title: string;
  countKey: keyof SearchCounts;
  filters: FilterRenderMethods[];
  getTotalText: (count: number) => string;
};

const tabSettingBySearchType: SearchTypeRecord<SearchTabSetting> = {
  [ESearchType.All]: {
    countKey: 'total',
    title: 'Везде',
    filters: [],
    getTotalText: (count: number) => selectPluralForm(count, ['объект', 'объекта', 'объектов']),
  },
  [ESearchType.StockElements]: {
    countKey: 'stocks',
    title: 'Каталог',
    filters: [],
    getTotalText: (count: number) => `${selectPluralForm(count, ['элемент', 'элемента', 'элементов'])} каталога`,
  },
  [ESearchType.Subscriptions]: {
    countKey: 'subscriptions',
    title: 'Подписки',
    getTotalText: (count: number) => selectPluralForm(count, ['подписка', 'подписки', 'подписок']),
    filters: [
      {
        getValue: ({ subscriptionFilters }: TSearchFilters) => subscriptionFilters?.status || [],
        component: SubscriptionTypeSearchFilter,
      },
    ],
  },
};

type SearchTypeKeys = keyof typeof ESearchType;

const searchTypeList: SearchTypeKeys[] = keys(ESearchType);

export const SearchResultTabs: React.FC<Props> = props => {
  const { counts, onFilter, variables, tab, onNavigateToTab, ...resultListProps } = props;

  const renderTitleCount = useCallback(
    (searchType: ESearchType): React.ReactElement => {
      const { title, countKey } = tabSettingBySearchType[searchType];

      return (
        <>
          {title} <span className={styles.count}>{counts[countKey]}</span>
        </>
      );
    },
    [counts],
  );

  return (
    <Card className={styles.searchResultTabs}>
      <TabList className={styles.tabs} tab={tab} onNavigateToTab={onNavigateToTab}>
        {searchTypeList.map(searchType => {
          const type = ESearchType[searchType];
          const title = renderTitleCount(type);
          const { filters, getTotalText } = tabSettingBySearchType[type];
          const searchFilters = filters.map(({ component, getValue }) => ({
            value: getValue(variables),
            component,
          }));

          return (
            <TabPane className={styles.tab} key={searchType} id={type} title={title}>
              <SearchResultList className={styles.searchList} getTotalText={getTotalText} {...resultListProps} />
              {Boolean(filters.length) && <SearchFilters onFilter={onFilter} filters={searchFilters} />}
            </TabPane>
          );
        })}
      </TabList>
    </Card>
  );
};
