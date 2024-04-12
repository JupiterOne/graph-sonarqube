import {
  Entity,
  IntegrationMissingKeyError,
  IntegrationStepExecutionContext,
  Relationship,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../../types';
import { createSonarqubeClient } from '../../../provider';
import { createUserEntity } from './converter';
import { buildAccountRelationship } from '../../utils';
import { Entities } from '../../constants';
import { getUserGroupKey } from '../../user-group/fetch-user-groups-api-v1/converter';

export async function fetchUsersV1(
  executionContext: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
) {
  const { instance, jobState, logger } = executionContext;
  const client = createSonarqubeClient(instance.config, logger);

  const convertedUsers: Entity[] = [];
  const relationships: Relationship[] = [];
  await client.iterateUsersV1(async (user) => {
    const userEntity = createUserEntity(user);
    convertedUsers.push(userEntity);
    const accountHasUserRelationship = buildAccountRelationship(
      executionContext,
      userEntity._key,
      userEntity._type,
    );
    if (accountHasUserRelationship) {
      relationships.push(accountHasUserRelationship);
    }
  });
  await jobState.addEntities(convertedUsers);
  await jobState.addRelationships(relationships);
}

export async function buildUserGroupUserRelationshipsV1({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config, logger);
  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      await client.iterateGroupsAssignedToUser(
        userEntity.login as string,
        async (userGroup) => {
          const userGroupEntityId = getUserGroupKey(userGroup.name);
          const userGroupEntity = await jobState.findEntity(userGroupEntityId);

          if (!userGroupEntity) {
            throw new IntegrationMissingKeyError(
              `Expected user group with key to exist (key=${userGroupEntityId})`,
            );
          }

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: userGroupEntity,
              to: userEntity,
            }),
          );
        },
      );
    },
  );
}
