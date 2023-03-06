import { IntegrationSpecConfig } from '@jupiterone/integration-sdk-core';

import { SonarqubeIntegrationConfig } from '../../../src/types';
import { accountSpec } from './account';
import { findingSpec } from './finding';
import { projectSpec } from './project';
import { userSpec } from './user';
import { userGroupSpec } from './user-group';

export const invocationConfig: IntegrationSpecConfig<SonarqubeIntegrationConfig> =
  {
    integrationSteps: [
      ...accountSpec,
      ...findingSpec,
      ...projectSpec,
      ...userSpec,
      ...userGroupSpec,
    ],
  };
