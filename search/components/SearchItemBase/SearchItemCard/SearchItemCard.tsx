import classNames from 'classnames';
import React from 'react';

import styles from './SearchItemCard.module.less';

export type Props = {
  className?: string;
};

export const SearchItemCard: React.FC<Props> = ({ children, className }) => (
  <div className={classNames(styles.searchItemCard, className)}>{children}</div>
);
