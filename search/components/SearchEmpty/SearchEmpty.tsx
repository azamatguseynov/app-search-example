import { Card } from '@dsm/frontend-react-kit/src/components/Card';
import React from 'react';

import { CopyToBuffer } from '../../../../components/CopyToBuffer';
import { environment } from '../../../../environments/environment';

import styles from './SearchEmpty.module.less';

type Props = {
  searchQuery: string;
};

const { orderNewSubscriptionLink } = environment;

export const SearchEmpty: React.FC<Props> = ({ searchQuery }) => (
  <Card className={styles.searchEmpty}>
    <p className={styles.notFoundText}>
      По запросу <span className={styles.searchQuery}>“{searchQuery}”</span> данные не найдены.
    </p>

    <div>
      <span className={styles.copyLinkText}>
        Как оформить запрос на новую подписку/расширение ассортимента, читайте по ссылке в сети Sigma
      </span>
      <CopyToBuffer textToCopy={orderNewSubscriptionLink}>Скопировать ссылку</CopyToBuffer>
    </div>
  </Card>
);
