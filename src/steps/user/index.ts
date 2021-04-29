import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Entities, Steps } from '../constants';
import { createUserEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);

  const convertedUsers: Entity[] = [];
  await client.iterateUsers(async (user) => {
    convertedUsers.push(createUserEntity(user));
  });
  await jobState.addEntities(convertedUsers);
}

export const userSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Users',
    entities: [Entities.USER],
    executionHandler: fetchUsers,
    relationships: [],
  },
];
