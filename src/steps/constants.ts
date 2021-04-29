import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const Steps = {
  PROJECTS: 'fetch-projects',
  USER_GROUPS: 'fetch-user-groups',
  USERS: 'fetch-users',
  BUILD_USER_GROUP_HAS_USER: 'build-user-group-has-user',
};

export const Entities = {
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
};

export const Relationships = {
  GROUP_HAS_USER: {
    _type: 'sonarqube_user_group_has_user',
    sourceType: Entities.USER_GROUP._type,
    _class: RelationshipClass.HAS,
    targetType: Entities.USER._type,
  },
};
