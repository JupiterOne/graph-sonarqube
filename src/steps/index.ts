import {
  IntegrationStepExecutionContext,
  Step,
} from '@jupiterone/integration-sdk-core';

import { SonarqubeIntegrationConfig } from '../types';
import projectStep from './fetch-projects';

const integrationSteps: Step<
  IntegrationStepExecutionContext<SonarqubeIntegrationConfig>
>[] = [projectStep];

export { integrationSteps };
