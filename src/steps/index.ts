import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { SonarqubeIntegrationConfig } from '../types';
import { projectSteps } from './project';
import { userGroupSteps } from './user-group';

const integrationSteps: Step<
  IntegrationStepExecutionContext<SonarqubeIntegrationConfig>
>[] = [...projectSteps, ...userGroupSteps];

export { integrationSteps };
