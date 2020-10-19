import React from 'react';

import { ReactComponent as LinkIcon } from '../../../../assets/icons/link.svg';
import { ReactComponent as UserIcon } from '../../../../assets/icons/user.svg';
import { EntityType } from '../../../../common/EntityTypeEnum';
import { EntityIcon } from '../../../../components/EntityIcon';
import { OwnerInfoCard } from '../../../../components/OwnerInfoCard';
import { TextHighlight } from '../../../../components/TextHightlight';
import { TextWithIcon } from '../../../../components/TextWithIcon';
import { EIconPosition, TextWithInfo } from '../../../../components/TextWithInfo';
import {
  EMainCategory,
  Search_search_items as SearchResponseItem,
} from '../../../../deps-api/graphql/__generated__/types';
import { buildCatalogPath } from '../../../../utils/catalogPath';
import { ISearchItem, SearchResultItemPath } from '../../types';

export const getStockElementSearchItem = (searchResult: SearchResponseItem): ISearchItem => {
  const { name, stocks, id, type } = searchResult;

  const {
    dataActuality,
    pmName,
    dictModelElementTypeId,
    pmDataType,
    mainCategoryDisplayName,
    mainCategory,
    mainCategoryId,
    parents,
    stockElementId,
    terms,
    ownerEmail,
    ownerName,
    ownerOrgStruct,
  } = stocks!;

  const owner = ownerName && (
    <TextWithInfo
      key="owner"
      title={ownerName}
      icon={<UserIcon />}
      iconPosition={EIconPosition.Before}
      info={<OwnerInfoCard ownerFullName={ownerName} ownerContacts={[ownerEmail, ownerOrgStruct]} />}>
      {ownerName}
    </TextWithInfo>
  );

  const entityType = String(dictModelElementTypeId) as EntityType;

  // TODO ess?
  const icon = <EntityIcon entityType={entityType} />;

  const termList = terms
    ? terms.map(({ name: termName, termId }) => (
        <TextWithIcon key={termId!} size="small" icon={<LinkIcon />}>
          <TextHighlight key={1}>{termName}</TextHighlight>
        </TextWithIcon>
      ))
    : [];

  const description: React.ReactNode[] = [
    <TextHighlight key={1}>{pmName}</TextHighlight>,
    dataActuality,
    pmDataType,
    ...termList,
    owner,
  ];

  const isMainCategoryEss = [EMainCategory.ESS, EMainCategory.IDL, EMainCategory.NDL].includes(mainCategory);
  const isMainCategoryNsi = EMainCategory.NSI === mainCategory;
  const isAttribute = [EntityType.NsiAttribute, EntityType.Attribute].includes(entityType);
  const isAttributeLinkHided = (isMainCategoryEss && isAttribute) || isMainCategoryNsi;
  const mainCategoryName = isMainCategoryEss ? EMainCategory.ESS : mainCategory;

  const getPath = (): SearchResultItemPath[] => {
    // TODO переделать на проверку подкадтегории, после поддержки этой истории беком.
    const categoryPath = buildCatalogPath(mainCategoryName, null, mainCategoryId!);
    const parentPath = parents!
      .slice()
      .reverse()
      .map(({ name: parentName, parentStockElementId, stockElementId: currentStockElementId }) => ({
        name: parentName ? parentName : '',
        link: buildCatalogPath(
          mainCategoryName,
          parentStockElementId ? EntityType.Table : EntityType.Schema,
          currentStockElementId!,
        ),
      }));

    return [
      {
        name: mainCategoryDisplayName ? mainCategoryDisplayName : '',
        link: categoryPath,
      },
      ...parentPath,
    ];
  };

  const path = getPath();

  const link = isAttributeLinkHided
    ? path[path.length - 1].link
    : buildCatalogPath(mainCategoryName, entityType, stockElementId!);

  return {
    id,
    type,
    icon,
    title: name,
    path,
    link,
    description,
    childrenList: [],
  };
};
