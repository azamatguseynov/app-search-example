import React, { ReactNode } from 'react';

import { ReactComponent as CategoryIcon } from '../../../../assets/icons/category.svg';
import { ReactComponent as AttributeIcon } from '../../../../assets/icons/file.svg';
import { ReactComponent as ObjectIcon } from '../../../../assets/icons/object.svg';
import { ReactComponent as TableIcon } from '../../../../assets/icons/table.svg';
import {
  ESubscriptionInnerType,
  Search_search_items_subscriptions_assortments as NestedSearchItem,
} from '../../../../deps-api/graphql/__generated__/types';
import { SearchItemHeading } from '../SearchItemBase/SearchItemHeading';

const StockElementIconByType = {
  [ESubscriptionInnerType.Attribute]: <AttributeIcon />,
  [ESubscriptionInnerType.Schema]: <TableIcon />,
  [ESubscriptionInnerType.Entity]: <ObjectIcon />,
  [ESubscriptionInnerType.DataSource]: <CategoryIcon />,
};

export const getSubscriptionSearchItemChildren = ({ name, type }: NestedSearchItem): ReactNode => {
  const iconByType = type ? StockElementIconByType[type] : '';

  return <SearchItemHeading icon={iconByType}>{name}</SearchItemHeading>;
};
