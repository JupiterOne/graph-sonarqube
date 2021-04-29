export interface SonarqubeProject {
  key: string;
  name: string;
  qualifier: 'TRK';
  visibility: 'public' | 'private';
  lastAnalysisDate: string;
  revision: string;
}

export interface SonarqubeUserGroup {
  id: string; // This value is unique but is NOT what ties relationships to users
  name: string; // This value is unique and is what ties relationships to users
  description: string;
  membersCount?: number;
  selected?: string;
  default: boolean;
}

export interface SonarqubeUser {
  login: string;
  name: string;
  active: boolean;
  email: string;
  groups: string[];
  tokensCount: number;
  local: boolean;
  externalIdentity: string;
  externalProvider: string;
  avatar: string;
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
