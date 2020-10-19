import classNames from 'classnames';
import React from 'react';

import { NodesWithSeparator } from '../../../../../components/NodesWithSeparator';
import { SearchResultItemPath } from '../../../types';
import { LinkOrText } from '../LinkOrText';

import styles from './SearchItemPath.module.less';

export type Props = {
  pathItems: SearchResultItemPath[];
  className?: string;
};

export const SearchItemPath: React.FC<Props> = ({ pathItems, className }) => (
  <NodesWithSeparator className={classNames(styles.path, className)} separator="/">
    {pathItems.map(({ name, link }, index) => (
      <LinkOrText key={index} link={link} linkClass={styles.pathLink} textClass={styles.pathLink_empty}>
        {name}
      </LinkOrText>
    ))}
  </NodesWithSeparator>
);
