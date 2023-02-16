import { RelationshipClass, StepSpec } from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../../../src/types';

export const findingSpec: StepSpec<SonarqubeIntegrationConfig>[] = [
  {
    id: 'fetch-findings',
    name: 'Fetch Project Findings',
    entities: [
      {
        resourceName: 'Finding',
        _type: 'sonarqube_finding',
        _class: ['Finding'],
      },
    ],
    relationships: [
      {
        _type: 'sonarqube_project_has_finding',
        sourceType: 'sonarqube_project',
        _class: RelationshipClass.HAS,
        targetType: 'sonarqube_finding',
      },
    ],
    dependsOn: ['fetch-projects'],
    implemented: true,
  },
];
