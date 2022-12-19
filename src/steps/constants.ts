import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const ACCOUNT_ENTITY_KEY = 'sonarqube:account';

export const Steps = {
  ACCOUNT: 'fetch-account',
  PROJECTS: 'fetch-projects',
  USER_GROUPS: 'fetch-user-groups',
  USERS: 'fetch-users',
  BUILD_USER_GROUP_HAS_USER: 'build-user-group-has-user',
  FINDINGS: 'fetch-findings',
};

export const Entities = {
  ACCOUNT: {
    resourceName: 'Account',
    _type: 'sonarqube_account',
    _class: ['Account'],
  },
  PROJECT: {
    resourceName: 'Project',
    _type: 'sonarqube_project',
    _class: ['Project'],
  },
  USER_GROUP: {
    resourceName: 'UserGroup',
    _type: 'sonarqube_user_group',
    _class: ['UserGroup'],
  },
  USER: {
    resourceName: 'User',
    _type: 'sonarqube_user',
    _class: ['User'],
  },
  FINDING: {
    resourceName: 'Finding',
    _type: 'sonarqube_finding',
    _class: ['Finding'],
  },
};

export const Relationships = {
  GROUP_HAS_USER: {
    _type: 'sonarqube_user_group_has_user',
    sourceType: Entities.USER_GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_PROJECT: {
    _type: 'sonarqube_account_has_project',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.PROJECT._type,
  },
  ACCOUNT_HAS_USER: {
    _type: 'sonarqube_account_has_user',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
  ACCOUNT_HAS_USER_GROUP: {
    _type: 'sonarqube_account_has_user_group',
    sourceType: Entities.ACCOUNT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER_GROUP._type,
  },
  PROJECT_HAS_FINDING: {
    _type: 'sonarqube_project_has_finding',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.FINDING._type,
  },
};
