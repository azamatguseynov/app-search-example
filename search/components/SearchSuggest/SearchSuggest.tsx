import { Card } from '@react-kit/components/Card';
import classNames from 'classnames';
import React, { useState } from 'react';

// import { Portal } from '../../../../components/Portal';
import { SearchInput } from '../../../../components/SearchInput';

import styles from './SearchSuggest.module.less';
import { SearchSuggestResult } from './SearchSuggestResult';

// TODO implement
export const SearchSuggest = () => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [isFocused, setFocused] = useState<boolean>();

  const handleSearchChange = ({ currentTarget: { value } }: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchValue(value);
  };

  const hideTooltip = () => {
    setFocused(false);
  };

  const handleSearchFocus = () => {
    setFocused(true);
  };

  const handleSearchBlur = () => {
    setFocused(false);
  };

  return (
    <div className={classNames({ [styles.overlay]: isFocused })} onClick={hideTooltip}>
      <Card className={classNames(styles.root, { [styles.focused]: isFocused })}>
        <SearchInput onChange={handleSearchChange} onFocus={handleSearchFocus} onBlur={handleSearchBlur} />
        {searchValue && <SearchSuggestResult searchQuery={searchValue} />}
      </Card>
    </div>
  );
};
