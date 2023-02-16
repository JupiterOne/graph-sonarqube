import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import {
  ACCOUNT_ENTITY_KEY,
  Entities,
  Relationships,
  Steps,
} from '../constants';
import { createUserGroupEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchUserGroups({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  const client = createSonarqubeClient(instance.config);

  await client.iterateUserGroups(async (userGroup) => {
    const userGroupEntity = await jobState.addEntity(
      createUserGroupEntity(userGroup),
    );

    await jobState.addRelationship(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userGroupEntity,
      }),
    );
  });
}

export const userGroupSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.USER_GROUPS,
    name: 'Fetch User Groups',
    entities: [Entities.USER_GROUP],
    executionHandler: fetchUserGroups,
    relationships: [Relationships.ACCOUNT_HAS_USER_GROUP],
    dependsOn: [Steps.ACCOUNT],
  },
];
