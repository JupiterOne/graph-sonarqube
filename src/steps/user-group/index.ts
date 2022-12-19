import {
  createDirectRelationship,
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
  Relationship,
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

  const convertedUserGroups: Entity[] = [];
  const relationships: Relationship[] = [];
  await client.iterateUserGroups((userGroup) => {
    const userGroupEntity = createUserGroupEntity(userGroup);
    convertedUserGroups.push(userGroupEntity);
    relationships.push(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userGroupEntity,
      }),
    );
  });
  await jobState.addEntities(convertedUserGroups);
  await jobState.addRelationships(relationships);
}

export const userGroupSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.USER_GROUPS,
    name: 'User Groups',
    entities: [Entities.USER_GROUP],
    executionHandler: fetchUserGroups,
    relationships: [Relationships.ACCOUNT_HAS_USER_GROUP],
    dependsOn: [Steps.ACCOUNT],
  },
];
