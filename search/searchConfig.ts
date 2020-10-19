import { ComponentType, ReactNode } from 'react';

import { ESearchItemType, Search_search_items as SearchResponseItem } from '../../deps-api/graphql/__generated__/types';

import { ISearchItemBaseProps, SearchItemBaseLayout } from './components/SearchItemBase/SearchItemBaseLayout';
import { getStockElementSearchItem } from './components/StockElementSearchItem';
import { getSubscriptionSearchItem, SubscriptionSearchItemView } from './components/SubscriptionSearchItem';
import { getSubscriptionSearchItemChildren } from './components/SubscriptionSearchItem/getSubscriptionSearchItemChildren';
import { ISearchItem } from './types';

interface ISearchItemRenderMethod {
  getSearchItem: (response: SearchResponseItem) => ISearchItem;
  getNestedSearchItem?: (nestedSearchResponseItem: any) => ReactNode;
  SearchItemLayout: ComponentType<ISearchItemBaseProps>;
}

export const searchConfig: Record<ESearchItemType, ISearchItemRenderMethod> = {
  [ESearchItemType.StockElement]: {
    getSearchItem: getStockElementSearchItem,
    SearchItemLayout: SearchItemBaseLayout,
  },
  [ESearchItemType.Subscription]: {
    getSearchItem: getSubscriptionSearchItem,
    getNestedSearchItem: getSubscriptionSearchItemChildren,
    SearchItemLayout: SubscriptionSearchItemView,
  },
};
