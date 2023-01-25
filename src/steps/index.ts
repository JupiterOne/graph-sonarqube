import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { SonarqubeIntegrationConfig } from '../types';
import { projectSteps } from './project';
import { userGroupSteps } from './user-group';
import { userSteps } from './user';
import { accountSteps } from './account';
import { findingSteps } from './finding';

const integrationSteps: Step<
  IntegrationStepExecutionContext<SonarqubeIntegrationConfig>
>[] = [
  ...accountSteps,
  ...projectSteps,
  ...userGroupSteps,
  ...userSteps,
  ...findingSteps,
];

export { integrationSteps };
