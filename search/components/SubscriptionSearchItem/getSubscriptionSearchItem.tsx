import React from 'react';

import { ReactComponent as UserIcon } from '../../../../assets/icons/user.svg';
import { OwnerInfoCard } from '../../../../components/OwnerInfoCard';
import { SubscriptionStatusIcon } from '../../../../components/SubscriptionStatusIcon';
import { EIconPosition, TextWithInfo } from '../../../../components/TextWithInfo';
import { Search_search_items as SearchResponseItem } from '../../../../deps-api/graphql/__generated__/types';
import { getFormattedDate } from '../../../../utils/getFormattedDate';
import { getScheduleText } from '../../../../utils/getSheduleText';
import { ISearchItem } from '../../types';

import { getSubscriptionSearchItemChildren } from './getSubscriptionSearchItemChildren';

export const getSubscriptionSearchItem = (searchResult: SearchResponseItem): ISearchItem => {
  const { name: title, subscriptions, id, type } = searchResult;
  const {
    scheduleFromTs,
    scheduleToTs,
    scheduleBody,
    dictSubscriptionStatusId,
    dictSubscriptionStatusDisplayName,
    subscriptionUuid,
    dictSubscriptionTypeId,
    assortments,
    assortmentsTotal,
    customer,
    customerDepartment,
  } = subscriptions!;

  const owner = customer && (
    <TextWithInfo
      key="owner"
      icon={<UserIcon />}
      iconPosition={EIconPosition.Before}
      info={<OwnerInfoCard ownerFullName={customer} ownerContacts={[customerDepartment]} />}>
      {customer}
    </TextWithInfo>
  );

  const period =
    scheduleFromTs && scheduleToTs && `${getFormattedDate(scheduleFromTs)} — ${getFormattedDate(scheduleToTs)}`;

  const description: React.ReactNode[] = [period, scheduleBody && getScheduleText(scheduleBody), owner];

  const icon = <SubscriptionStatusIcon status={dictSubscriptionStatusId!} type={dictSubscriptionTypeId!} />;

  const path = [
    { link: '/subscriptions/registry', name: 'Подписки' },
    { name: dictSubscriptionStatusDisplayName || '' },
  ];

  const link = `/subscriptions/${subscriptionUuid}`;

  const childrenList: React.ReactNode[] = assortments.map(getSubscriptionSearchItemChildren);

  const childrenTotal = assortmentsTotal;

  return {
    id,
    type,
    icon,
    title,
    link,
    path,
    description,
    childrenList,
    childrenTotal,
  };
};
