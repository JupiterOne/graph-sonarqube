import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { SonarqubeIntegrationConfig } from '../types';
import { projectSteps } from './project';

const integrationSteps: Step<
  IntegrationStepExecutionContext<SonarqubeIntegrationConfig>
>[] = [...projectSteps];

export { integrationSteps };
