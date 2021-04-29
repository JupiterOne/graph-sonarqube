import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { SonarqubeIntegrationConfig } from '../types';
import { projectSteps } from './project';
import { userGroupSteps } from './user-group';
import { userSteps } from './user';

const integrationSteps: Step<
  IntegrationStepExecutionContext<SonarqubeIntegrationConfig>
>[] = [...projectSteps, ...userGroupSteps, ...userSteps];

export { integrationSteps };
