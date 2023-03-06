import {
  DisabledStepReason,
  IntegrationExecutionContext,
  StepStartStates,
} from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from './types';

export default async function getStepStartStates(
  context: IntegrationExecutionContext<SonarqubeIntegrationConfig>,
): Promise<StepStartStates> {
  return {
    ['fetch-account']: {
      disabled: false,
    },
    ['fetch-projects']: {
      disabled: false,
    },
    ['fetch-user-groups']: {
      disabled: false,
    },
    ['fetch-users']: {
      disabled: false,
    },
    ['build-user-group-has-user']: {
      disabled: false,
    },
    ['fetch-findings']: {
      disabled: !context.instance.config.enableFindingsIngestion,
      disabledReason: DisabledStepReason.BETA,
    },
  };
}
