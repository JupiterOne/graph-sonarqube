import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../../../src/types';

export const projectSpec: StepSpec<SonarqubeIntegrationConfig>[] = [
  {
    id: 'fetch-projects',
    name: 'Fetch Projects',
    entities: [
      {
        resourceName: 'Project',
        _type: 'sonarqube_project',
        _class: ['Project'],
      },
    ],
    relationships: [
      {
        _type: 'sonarqube_account_has_project',
        sourceType: 'sonarqube_account',
        _class: RelationshipClass.HAS,
        targetType: 'sonarqube_project',
      },
    ],
    dependsOn: ['fetch-account'],
    implemented: true,
  },
];
