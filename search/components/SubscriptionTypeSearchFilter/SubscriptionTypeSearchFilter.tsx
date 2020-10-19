import { CheckboxGroup, CheckboxOptionType, CheckboxValueType } from '@react-kit/components/Checkbox';
import classNames from 'classnames';
import { keys } from 'ramda';
import React, { useCallback, useState } from 'react';

import { ESubscriptionStatus } from '../../../../deps-api/graphql/__generated__/types';
import { SearchFilterTypeProps } from '../SearchFilters/SearchFilters';

import styles from './SubscriptionTypeSearchFilter.module.less';

type BySubscriptionStatusKeys<T> = Record<ESubscriptionStatus, T>;

type CheckboxSettings = {
  label: string;
  hidden?: boolean;
  bind?: ESubscriptionStatus[];
};

type Props = SearchFilterTypeProps<CheckboxValueType[]>;

const settings: BySubscriptionStatusKeys<CheckboxSettings> = {
  [ESubscriptionStatus.Active]: { label: 'Активные' },
  [ESubscriptionStatus.Archived]: { label: 'Архивные' },
  [ESubscriptionStatus.Blocked]: { label: 'Заблокированные', hidden: true },
  [ESubscriptionStatus.Canceling]: { label: 'Отменяется', hidden: true },
  [ESubscriptionStatus.Canceled]: {
    label: 'Отмененные',
    bind: [ESubscriptionStatus.Blocked, ESubscriptionStatus.Canceling],
  },
  [ESubscriptionStatus.Ready]: { label: 'Новые', hidden: true },
  [ESubscriptionStatus.Draft]: { label: 'Черновики', hidden: true },
  [ESubscriptionStatus.Failed]: { label: 'С ошибкой' },
  [ESubscriptionStatus.Done]: { label: 'Завершенные' },
  [ESubscriptionStatus.Paused]: { label: 'Приостановленные' },
};

const subscriptionStatusKeys = keys(ESubscriptionStatus);

const subscriptionTypeCheckboxOptions: CheckboxOptionType[] = subscriptionStatusKeys.map(status => {
  const { label, hidden } = settings[status];

  return {
    label,
    value: ESubscriptionStatus[status],
    disabled: hidden,
  };
});

const getBindStatuses = (statuses: ESubscriptionStatus[]) =>
  statuses
    .filter(value => !settings[value].hidden)
    .flatMap(value => {
      const { bind } = settings[value];

      return bind ? [value, ...bind] : value;
    });

export const SubscriptionTypeSearchFilter: React.FC<Props> = ({ onFilter, className, value }) => {
  const [state, setState] = useState(value);

  const handleChange = useCallback(
    (checkboxValues: CheckboxValueType[]) => {
      const statuses = getBindStatuses(checkboxValues as ESubscriptionStatus[]);

      setState(statuses);

      onFilter({ subscriptionFilters: { status: statuses } });
    },
    [onFilter, setState],
  );

  return (
    <div className={classNames(styles.filter, className)}>
      <CheckboxGroup onChange={handleChange} options={subscriptionTypeCheckboxOptions} value={state} />
    </div>
  );
};
