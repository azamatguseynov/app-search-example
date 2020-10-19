import { Button } from '@dsm/frontend-react-kit/src/components/Button';
import { Loader } from '@dsm/frontend-react-kit/src/components/Loader';
import classNames from 'classnames';
import { UseSearch } from 'pages/search/hooks/useSearch';
import React from 'react';

import { ReactComponent as SearchIcon } from '../../../../../assets/icons/search.svg';
import { UseSearchState } from '../../../hooks/useSearch';
import { searchConfig } from '../../../searchConfig';

import styles from './SearchResultList.module.less';

export type Props = Pick<UseSearch, 'onFetchMore' | 'onFetchMoreNested'> &
  Pick<UseSearchState, 'items' | 'total' | 'isFetchingMore' | 'isFiltering'> & {
    className?: string;
    getTotalText: (count: number) => string;
  };

export const SearchResultList: React.FC<Props> = props => {
  const { items, onFetchMore, isFetchingMore, className, total, getTotalText, isFiltering, onFetchMoreNested } = props;
  const hasMoreToFetch = total > items.length;

  if (isFiltering) {
    return <Loader />;
  }

  if (!items.length) {
    return (
      <div className={classNames(styles.noResults, className)}>
        <SearchIcon className={styles.noResultsIcon} />
        <div className={styles.noResultsTitle}>Нет результатов :(</div>
        <div className={styles.noResultsDescription}>По вашему запросу ничего не найдено</div>
      </div>
    );
  }

  return (
    <div className={classNames(styles.searchResult, className)}>
      <div className={styles.currentTotal}>{getTotalText(total)}</div>

      {items.map(searchItem => {
        const { SearchItemLayout } = searchConfig[searchItem.type];

        return (
          <SearchItemLayout
            key={searchItem.id}
            searchItem={searchItem}
            className={styles.searchItem}
            onFetchMoreNested={onFetchMoreNested}
          />
        );
      })}

      {hasMoreToFetch && (
        <Button className={styles.fetchMoreButton} block={true} onClick={onFetchMore} loading={isFetchingMore}>
          Загрузить еще
        </Button>
      )}
    </div>
  );
};
