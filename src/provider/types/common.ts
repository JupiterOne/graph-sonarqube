export enum APIVersion {
  V1 = 'v1',
  V2 = 'v2',
}

export const APIVersionBaseUrl = {
  [APIVersion.V1]: '/api',
  [APIVersion.V2]: '/api/v2',
};

export const PaginationQueryParams = {
  [APIVersion.V1]: {
    pageSize: 'ps',
    pageIndex: 'p',
  },
  [APIVersion.V2]: {
    pageSize: 'pageSize',
    pageIndex: 'pageIndex',
  },
};

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export type PaginatedResponse<T extends string, U> = {
  [Key in 'paging' | 'page']: Pagination;
} & {
  [K in T]: U[];
};
