import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Entities, Steps } from '../constants';
import { createUserGroupEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchUserGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);

  const convertedUserGroups: Entity[] = [];
  await client.iterateUserGroups(async (userGroup) => {
    convertedUserGroups.push(createUserGroupEntity(userGroup));
  });
  await jobState.addEntities(convertedUserGroups);
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
