import { Action } from '../../../../common/ActionType';
import { SearchVariables } from '../../../../deps-api/graphql/__generated__/types';
import { ISearchItem, SearchCounts } from '../../types';

import { NestedSearchResponse, SearchResponse } from './SearchResponseType';

export enum EUseSearchAction {
  SearchStart = 'searchStart',
  SearchSuccess = 'searchSuccess',
  SearchFailed = 'searchFailed',

  FilterStart = 'filterStart',
  FilterSuccess = 'filterSuccess',
  FilterFailed = 'filterFailed',

  FetchMoreStart = 'setFetchingMore',
  FetchMoreSuccess = 'fetchMoreSuccess',
  FetchMoreFailed = 'fetchMoreFailed',

  FetchMoreNestedSuccess = 'fetchMoreSubscriptionSuccess',

  Clear = 'clear',
}

type SearchStartAction = Action<EUseSearchAction.SearchStart, SearchVariables>;
type SearchSuccessAction = Action<EUseSearchAction.SearchSuccess, SearchResponse>;
type SearchFailedAction = Action<EUseSearchAction.SearchFailed>;

type FilterStartAction = Action<EUseSearchAction.FilterStart, SearchVariables>;
type FilterSuccessAction = Action<EUseSearchAction.FilterSuccess, SearchResponse>;
type FilterFailedAction = Action<EUseSearchAction.FilterFailed>;

type FetchMoreStartAction = Action<EUseSearchAction.FetchMoreStart>;
type FetchMoreSuccessAction = Action<EUseSearchAction.FetchMoreSuccess, SearchResponse>;
type FetchMoreFailedAction = Action<EUseSearchAction.FetchMoreFailed>;

type FetchMoreNestedSuccessAction = Action<EUseSearchAction.FetchMoreNestedSuccess, NestedSearchResponse>;

type ClearAction = Action<EUseSearchAction.Clear>;

export type UseSearchActions =
  | SearchStartAction
  | SearchSuccessAction
  | SearchFailedAction
  | FilterStartAction
  | FilterSuccessAction
  | FilterFailedAction
  | FetchMoreStartAction
  | FetchMoreSuccessAction
  | FetchMoreFailedAction
  | FetchMoreNestedSuccessAction
  | ClearAction;

export type UseSearchState = {
  isSearching: boolean;
  isSearched: boolean;
  isSearchErrored: boolean;
  isFiltering: boolean;
  isFilterErrored: boolean;
  isFetchingMore: boolean;
  isFetchMoreErrored: boolean;
  items: ISearchItem[];
  total: number;
  counts: SearchCounts;
  variables: SearchVariables;
};

const SEARCH_PAGINATION_STEP = 10;
const SEARCH_PAGINATION_NESTED_TAKE = 1;

export const initialSearchVariables = {
  query: '',
  take: SEARCH_PAGINATION_STEP,
  searchItemType: null,
  nestedTake: SEARCH_PAGINATION_NESTED_TAKE,
};

export const initialUseSearchState: UseSearchState = {
  isSearching: false,
  isSearched: false,
  isSearchErrored: false,
  isFilterErrored: false,
  isFiltering: false,
  isFetchingMore: false,
  isFetchMoreErrored: false,
  items: [],
  total: 0,
  counts: { total: 0, subscriptions: 0, stocks: 0 },
  variables: initialSearchVariables,
};

export const useSearchReducer = (state: UseSearchState, action: UseSearchActions): UseSearchState => {
  switch (action.type) {
    case EUseSearchAction.SearchStart:
      return {
        ...state,
        items: [],
        variables: action.payload,
        isSearching: true,
        isSearched: true,
      };

    case EUseSearchAction.SearchSuccess: {
      const { items: searchItems, total, counts } = action.payload;

      return {
        ...state,
        items: searchItems,
        counts,
        total,
        isSearching: false,
        isSearchErrored: false,
        isFetchMoreErrored: false,
        isFilterErrored: false,
      };
    }

    case EUseSearchAction.SearchFailed:
      return {
        ...state,
        isSearchErrored: true,
        isSearching: false,
      };

    case EUseSearchAction.FilterStart:
      return {
        ...state,
        items: [],
        variables: action.payload,
        isFiltering: true,
      };

    case EUseSearchAction.FilterSuccess: {
      const { items: searchItems, total } = action.payload;

      return {
        ...state,
        items: searchItems,
        total,
        isFiltering: false,
        isSearchErrored: false,
        isFilterErrored: false,
        isFetchMoreErrored: false,
      };
    }

    case EUseSearchAction.FilterFailed:
      return {
        ...state,
        isFilterErrored: true,
        isFiltering: false,
      };

    case EUseSearchAction.FetchMoreStart:
      return {
        ...state,
        isFetchingMore: true,
      };

    case EUseSearchAction.FetchMoreSuccess: {
      const { items: searchItems } = action.payload;

      return {
        ...state,
        items: [...state.items, ...searchItems],
        isFetchingMore: false,
        isSearchErrored: false,
        isFilterErrored: false,
        isFetchMoreErrored: false,
      };
    }

    case EUseSearchAction.FetchMoreFailed:
      return {
        ...state,
        isFetchMoreErrored: true,
        isFetchingMore: false,
      };

    case EUseSearchAction.FetchMoreNestedSuccess:
      const { items, id } = action.payload;
      const updateChildrenList = (element: ISearchItem) =>
        element.id === id ? { ...element, childrenList: [...element.childrenList, ...items] } : element;

      return {
        ...state,
        items: state.items.map(updateChildrenList),
      };

    case EUseSearchAction.Clear:
      return initialUseSearchState;

    default:
      return state;
  }
};

export const SearchStartAction = (payload: SearchVariables): SearchStartAction => ({
  type: EUseSearchAction.SearchStart,
  payload,
});

export const SearchSuccessAction = (payload: SearchResponse): SearchSuccessAction => ({
  type: EUseSearchAction.SearchSuccess,
  payload,
});

export const SearchFailedAction = (): SearchFailedAction => ({ type: EUseSearchAction.SearchFailed });

export const FilterStartAction = (payload: SearchVariables): FilterStartAction => ({
  type: EUseSearchAction.FilterStart,
  payload,
});

export const FilterSuccessAction = (payload: SearchResponse): FilterSuccessAction => ({
  type: EUseSearchAction.FilterSuccess,
  payload,
});

export const FilterFailedAction = (): FilterFailedAction => ({ type: EUseSearchAction.FilterFailed });

export const FetchMoreStartAction = (): FetchMoreStartAction => ({ type: EUseSearchAction.FetchMoreStart });

export const FetchMoreSuccessAction = (payload: SearchResponse): FetchMoreSuccessAction => ({
  type: EUseSearchAction.FetchMoreSuccess,
  payload,
});

export const FetchMoreNestedSuccessAction = (payload: NestedSearchResponse): FetchMoreNestedSuccessAction => ({
  type: EUseSearchAction.FetchMoreNestedSuccess,
  payload,
});

export const FetchMoreFailedAction = (): FetchMoreFailedAction => ({ type: EUseSearchAction.FetchMoreFailed });

export const ClearAction = (): ClearAction => ({ type: EUseSearchAction.Clear });
