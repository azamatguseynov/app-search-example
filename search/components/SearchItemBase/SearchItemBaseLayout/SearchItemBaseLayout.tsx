import React from 'react';

import { NodesWithSeparator } from '../../../../../components/NodesWithSeparator';
import { ISearchItem } from '../../../types';
import { LinkOrText } from '../LinkOrText';
import { SearchItemCard } from '../SearchItemCard';
import { SearchItemHeading } from '../SearchItemHeading';
import { SearchItemPath } from '../SearchItemPath';

import styles from './SearchItemBaseLayout.module.less';

export interface ISearchItemBaseProps {
  searchItem: ISearchItem;
  className?: string;
  onFetchMoreNested?: (id: string, take: number, skip: number) => Promise<void>;
}

export const SearchItemBaseLayout: React.FC<ISearchItemBaseProps> = ({ searchItem, children, className }) => {
  const { icon, title, path = [], description = [], link: searchItemLink } = searchItem;

  return (
    <SearchItemCard className={className}>
      <LinkOrText link={searchItemLink} linkClass={styles.linkOrText}>
        <SearchItemHeading className={styles.heading} icon={icon}>
          {title}
        </SearchItemHeading>
      </LinkOrText>

      <SearchItemPath pathItems={path} />

      <NodesWithSeparator className={styles.description} separator="•">
        {description}
      </NodesWithSeparator>
      {children && <div className={styles.body}>{children}</div>}
    </SearchItemCard>
  );
};
