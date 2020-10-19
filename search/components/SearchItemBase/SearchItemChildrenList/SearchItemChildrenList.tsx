import { Button } from '@dsm/frontend-react-kit/src/components/Button';
import { Scroll } from '@react-kit/components/Scroll';
import { useDidUnmount } from '@react-kit/hooks/useDidUnmount';
import React, { useCallback, useState } from 'react';

import { ReactComponent as ArrowIcon } from '../../../../../assets/icons/arrow-drop-down.svg';
import { selectPluralForm } from '../../../../../utils/selectPluralForm';

import styles from './SearchItemChildrenList.module.less';

export type Props = {
  childrenList: React.ReactNode[];
  childrenTotal?: number | null;
  onFetchMore?: (take: number, skip: number) => Promise<void>;
};

export const SEARCH_PAGINATION_NESTED_STEP = 10;

export const SearchItemChildrenList: React.FC<Props> = ({ childrenList, childrenTotal, onFetchMore }) => {
  const didUnmount = useDidUnmount();
  const [isFetchingMore, setIsFetchingMore] = useState(false);

  const total = childrenTotal ?? 0;

  const take =
    total - childrenList.length > SEARCH_PAGINATION_NESTED_STEP
      ? SEARCH_PAGINATION_NESTED_STEP
      : total - childrenList.length;

  const handleFetchMore = useCallback(async () => {
    if (!onFetchMore) return;

    setIsFetchingMore(true);

    await onFetchMore(take, childrenList.length);

    if (!didUnmount.current) setIsFetchingMore(false);
  }, [onFetchMore, childrenList.length, take, didUnmount]);

  const ExpandButton = React.memo(
    (): React.ReactElement => {
      return (
        <div className={styles.expandButtonWrapper}>
          <Button size="small" onClick={handleFetchMore} block={true} loading={isFetchingMore}>
            {`Показать еще ${selectPluralForm(take, ['объект', 'объекта', 'объектов'])}`}
            <ArrowIcon className={styles.arrowIcon} />
          </Button>
        </div>
      );
    },
  );

  return (
    <Scroll maxHeight={450}>
      <div className={styles.childrenList}>
        {childrenList.map((item, index) => (
          <div className={styles.childrenItem} key={index}>
            {item}
          </div>
        ))}
        {childrenList.length !== Number(childrenTotal) && <ExpandButton />}
      </div>
    </Scroll>
  );
};
