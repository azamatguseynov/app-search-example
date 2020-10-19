import classNames from 'classnames';
import React from 'react';

import { TextHighlight } from '../../../../../components/TextHightlight';

import styles from './SearchItemHeading.module.less';

export type Props = {
  icon: React.ReactNode;
  className?: string;
};

export const SearchItemHeading: React.FC<Props> = ({ icon, children, className }) => {
  return (
    <div className={classNames(styles.heading, className)}>
      <i className={styles.icon}>{icon}</i>
      <h4 className={styles.title}>
        <TextHighlight>{children}</TextHighlight>
      </h4>
    </div>
  );
};
