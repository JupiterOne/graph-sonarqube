import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Entities, Steps } from '../constants';
import { createUserEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeUser } from '../../provider/types';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);
  const userKeys = new Set<string>();
  const addUserEntity = async (user: SonarqubeUser): Promise<Entity> => {
    const userEntity = createUserEntity(user);
    if (!userKeys.has(userEntity._key)) {
      await jobState.addEntity(userEntity);
      userKeys.add(userEntity._key);
    }
    return userEntity;
  };

  await client.iterateUsers(async (user) => {
    await addUserEntity(user);
  });
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
