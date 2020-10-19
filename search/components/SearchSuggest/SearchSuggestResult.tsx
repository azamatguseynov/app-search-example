import React from 'react';

import { EntityType } from '../../../../common/EntityTypeEnum';
import { EntityIcon } from '../../../../components/EntityIcon';
import { HTMLSanitize } from '../../../../components/HTMLSanitize';

import styles from './SearchSuggestResult.module.less';

const mockResults = [
  {
    value: 'Реестр валютных курсов',
    category: EntityType.Category,
    otherInfo: 'Архивная  •  Файл. выгрузка  •  01.04.2018 — 01.10.2018  •  Ежедневно. 10:00',
  },
  {
    value: 'Таблица обменных курсов',
    category: EntityType.SubCategory,
    otherInfo: 'Активная  •  SQL-доступ  •  21.02.2019 — 21.08.2019  •  Четверг. 16:00',
  },
  {
    value: 'Обменные курсы',
    category: EntityType.Attribute,
    otherInfo: 'Приостановленна  •  SQL-доступ  •  21.02.2019 — 21.08.2019  •  Четверг. 16:00',
  },
];

type Values = {
  value: string;
  category: EntityType;
  otherInfo: string;
};

type ValuesProps = {
  results: Values[];
  searchQuery: string;
};

type HighlightQueryTextProps = {
  value: string;
  searchQuery: string;
};

const HighlightQueryText: React.FC<HighlightQueryTextProps> = ({ value, searchQuery }) => {
  const re = new RegExp(searchQuery, 'g');
  const newValue = value.replace(re, `<span style="font-weight:700;">${searchQuery}</span>`);
  return <HTMLSanitize content={newValue} />;
};

const CategoryValues: React.FC<ValuesProps> = ({ results, searchQuery }) => {
  return (
    <ul>
      {results.map((item, index) => (
        <li key={index} className={styles.row}>
          <div className={styles.content}>
            <EntityIcon entityType={item.category} className={styles.icon} />
            <HighlightQueryText value={item.value} searchQuery={searchQuery} />
          </div>
          <div className={styles.description}>
            <span>{item.otherInfo}</span>
          </div>
        </li>
      ))}
    </ul>
  );
};

export const SearchSuggestResult: React.FC<{ searchQuery: string }> = ({ searchQuery }) => (
  <div className={styles.root}>
    <div className={styles.result}>
      <CategoryValues results={mockResults} searchQuery={searchQuery} />
    </div>
  </div>
);
