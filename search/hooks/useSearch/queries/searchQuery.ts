import gql from 'graphql-tag';

export const searchQuery = gql`
  query Search(
    $skip: Int
    $take: Int
    $query: String!
    $searchItemType: ESearchItemType
    $subscriptionFilters: SubscriptionFilters
    $nestedTake: Int
  ) {
    search(
      skip: $skip
      take: $take
      query: $query
      searchItemType: $searchItemType
      subscriptionFilters: $subscriptionFilters
      nestedTake: $nestedTake
    ) {
      total
      items {
        type
        name
        id
        subscriptions {
          scheduleFromTs
          scheduleToTs
          scheduleBody
          dictSubscriptionStatusId
          dictSubscriptionStatusDisplayName
          subscriptionUuid
          dictSubscriptionTypeId
          customer
          customerDepartment
          assortmentsTotal
          assortments {
            name
            type
          }
        }
        stocks {
          dataActuality
          pmName
          dictModelElementTypeId
          pmDataType
          mainCategoryDisplayName
          mainCategory
          mainCategoryId
          stockElementId
          ownerEmail
          ownerName
          ownerOrgStruct
          terms {
            name
            termId
          }
          parents {
            name
            stockElementId
            parentStockElementId
          }
        }
      }
    }

    counts: search(skip: $skip, take: $take, query: $query) {
      counts {
        subscriptions
        stocks
        total
      }
    }
  }
`;

export const paginateNestedSearchQuery = gql`
  query PaginateNestedSearch($query: String!, $id: String, $nestedTake: Int, $nestedSkip: Int) {
    nestedSearchItems: search(query: $query, id: $id, nestedTake: $nestedTake, nestedSkip: $nestedSkip) {
      items {
        id
        pagination: subscriptions {
          items: assortments {
            name
            type
          }
        }
      }
    }
  }
`;
