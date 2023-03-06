import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';

import instanceConfigFields from './instanceConfigFields';
import { integrationSteps } from './steps';
import { SonarqubeIntegrationConfig } from './types';
import validateInvocation from './validateInvocation';
import getStepStartStates from './getStepStartStates';

export const invocationConfig: IntegrationInvocationConfig<SonarqubeIntegrationConfig> = {
  instanceConfigFields,
  validateInvocation,
  getStepStartStates,
  integrationSteps,
};
