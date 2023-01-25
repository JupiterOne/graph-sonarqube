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

export interface SonarqubeFinding {
  key: string;
  rule: string;
  severity: string;
  component: string;
  project: string;
  line: number;
  hash: string;
  textRange: {
    startLine: number;
    endLine: number;
    startOffset: number;
    endOffset: number;
  };
  status: string;
  message: string;
  effort: string;
  debt: string;
  author: string;
  tags: string[];
  creationDate: string;
  updateDate: string;
  type: string;
  scope: string;
  quickFixAvailable: boolean;
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
