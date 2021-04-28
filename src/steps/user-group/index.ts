import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Entities, Steps } from '../constants';
import { createUserGroupEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeUserGroup } from '../../provider/types';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchUserGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);
  const userGroupKeys = new Set<string>();
  const addUserGroupEntity = async (
    userGroup: SonarqubeUserGroup,
  ): Promise<Entity> => {
    const userGroupEntity = createUserGroupEntity(userGroup);
    if (!userGroupKeys.has(userGroupEntity._key)) {
      await jobState.addEntity(userGroupEntity);
      userGroupKeys.add(userGroupEntity._key);
    }
    return userGroupEntity;
  };

  await client.iterateUserGroups(async (userGroup) => {
    await addUserGroupEntity(userGroup);
  });
}

export const userGroupSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.USER_GROUPS,
    name: 'User Groups',
    entities: [Entities.USER_GROUP],
    executionHandler: fetchUserGroups,
    relationships: [],
  },
];
