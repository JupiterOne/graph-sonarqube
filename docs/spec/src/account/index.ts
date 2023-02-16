import { StepSpec } from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../../../src/types';

export const accountSpec: StepSpec<SonarqubeIntegrationConfig>[] = [
  {
    id: 'fetch-account',
    name: 'Fetch Account',
    entities: [
      {
        resourceName: 'Account',
        _type: 'sonarqube_account',
        _class: ['Account'],
      },
    ],
    relationships: [],
    implemented: true,
  },
];
