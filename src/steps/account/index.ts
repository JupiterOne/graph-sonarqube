import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { ACCOUNT_ENTITY_KEY, Entities, Steps } from '../constants';
import { createAccountEntity } from './converter';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchAccount({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const accountEntity = await jobState.addEntity(createAccountEntity(instance));
  await jobState.setData(ACCOUNT_ENTITY_KEY, accountEntity);
}

export const accountSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.ACCOUNT,
    name: 'Fetch Account',
    entities: [Entities.ACCOUNT],
    executionHandler: fetchAccount,
    relationships: [],
  },
];
