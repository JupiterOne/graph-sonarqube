import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../../../src/types';

export const userGroupSpec: StepSpec<SonarqubeIntegrationConfig>[] = [
  {
    id: 'fetch-user-groups',
    name: 'Fetch User Groups',
    entities: [
      {
        resourceName: 'UserGroup',
        _type: 'sonarqube_user_group',
        _class: ['UserGroup'],
      },
    ],
    relationships: [
      {
        _type: 'sonarqube_account_has_user_group',
        sourceType: 'sonarqube_account',
        _class: RelationshipClass.HAS,
        targetType: 'sonarqube_user_group',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
