import React, { useCallback } from 'react';

import { ISearchItemBaseProps, SearchItemChildrenList } from '../SearchItemBase';
import { SearchItemBaseLayout } from '../SearchItemBase/SearchItemBaseLayout';

export const SubscriptionSearchItemView: React.FC<ISearchItemBaseProps> = props => {
  const { searchItem, className, onFetchMoreNested } = props;
  const { childrenList, childrenTotal, id } = searchItem;

  const handleFetchMoreNested = useCallback((take: number, skip: number) => onFetchMoreNested!(id, take, skip), [
    onFetchMoreNested,
    id,
  ]);

  return (
    <SearchItemBaseLayout searchItem={searchItem} className={className}>
      {Boolean(childrenList.length) && (
        <SearchItemChildrenList
          childrenList={childrenList}
          childrenTotal={childrenTotal}
          onFetchMore={handleFetchMoreNested}
        />
      )}
    </SearchItemBaseLayout>
  );
};
