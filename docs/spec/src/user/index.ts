import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../../../src/types';

export const userSpec: StepSpec<SonarqubeIntegrationConfig>[] = [
  {
    id: 'fetch-users',
    name: 'Fetch Users',
    entities: [
      {
        resourceName: 'User',
        _type: 'sonarqube_user',
        _class: ['User'],
      },
    ],
    relationships: [
      {
        _type: 'sonarqube_account_has_user',
        sourceType: 'sonarqube_account',
        _class: RelationshipClass.HAS,
        targetType: 'sonarqube_user',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
  {
    id: 'build-user-group-has-user',
    name: 'Build user group user relationship',
    entities: [],
    relationships: [
      {
        _type: 'sonarqube_user_group_has_user',
        sourceType: 'sonarqube_user_group',
        _class: RelationshipClass.HAS,
        targetType: 'sonarqube_user',
      },
    ],
    dependsOn: ['fetch-user-groups', 'fetch-users'],
    implemented: true,
  },
];
