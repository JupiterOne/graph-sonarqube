export interface SonarqubeUserGroupV2 {
  id: string;
  name: string;
  description: string;
  default: boolean;
  managed: boolean;
}

export interface SonarqubeUserV2 {
  id: string;
  login: string;
  name: string;
  email: string | null;
  active: boolean;
  local: boolean;
  managed: boolean;
  externalLogin: string;
  externalProvider: string;
  avatar: string;
  sonarQubeLastConnectionDate: string;
  sonarLintLastConnectionDate: string;
}

export interface SonarqubeGroupMembership {
  id: string;
  groupId: string;
  userId: string;
}
