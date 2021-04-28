export interface SonarqubeProject {
  key: string;
  name: string;
  qualifier: 'TRK';
  visibility: 'public' | 'private';
  lastAnalysisDate: string;
  revision: string;
}

export interface Pagination {
  pageIndex: number;
  pageSize: number;
  total: number;
}

export type PaginatedResponse<T extends string, U> = { paging: Pagination } & {
  [K in T]: U[];
};

export interface ValidationResponse {
  valid: boolean;
}
