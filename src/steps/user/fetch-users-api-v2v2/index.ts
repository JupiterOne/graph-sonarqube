import {
  IntegrationStepExecutionContext,
  Entity,
  Relationship,
  createDirectRelationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';
import { createSonarqubeClient } from '../../../provider';
import { SonarqubeUserV2 } from '../../../provider/types/v2';
import { SonarqubeIntegrationConfig } from '../../../types';
import { Entities } from '../../constants';
import { getUserGroupV2Key } from '../../user-group/fetch-user-groups-api-v2/converter';
import { buildAccountRelationship } from '../../utils';
import { createUserV2Entity, getUserV2EntityKey } from './converter';

export async function fetchUsersV2(
  executionContext: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
) {
  const { instance, jobState, logger } = executionContext;
  const client = createSonarqubeClient(instance.config, logger);

  const userEntities: Entity[] = [];
  const accountHasUserRelationships: Relationship[] = [];
  await client.iterateUsersV2(async (user: SonarqubeUserV2) => {
    const userEntity = createUserV2Entity(user);
    if (userEntity) {
      userEntities.push(userEntity);
      const accountHasUserRelationship = await buildAccountRelationship(
        executionContext,
        userEntity._key,
        userEntity._type,
      );
      if (accountHasUserRelationship) {
        accountHasUserRelationships.push(accountHasUserRelationship);
      }
    }
  });
  await jobState.addEntities(userEntities);
  await jobState.addRelationships(accountHasUserRelationships);
}

export async function buildUserGroupUserRelationshipsV2({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config, logger);
  await client.iterateGroupMemberships(async ({ userId, groupId }) => {
    const groupEntityKey = getUserGroupV2Key(groupId);
    const userEntityKey = getUserV2EntityKey(userId);
    if (jobState.hasKey(groupEntityKey) && jobState.hasKey(userEntityKey)) {
      const groupHasUserRelationship = createDirectRelationship({
        _class: RelationshipClass.HAS,
        fromKey: groupEntityKey,
        fromType: Entities.USER_GROUP._type,
        toKey: userEntityKey,
        toType: Entities.USER._type,
      });
      await jobState.addRelationship(groupHasUserRelationship);
    }
  });
}
