import {
  createDirectRelationship,
  Entity,
  IntegrationMissingKeyError,
  IntegrationStep,
  IntegrationStepExecutionContext,
  Relationship,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import {
  Entities,
  Steps,
  Relationships,
  ACCOUNT_ENTITY_KEY,
} from '../constants';
import { createUserEntity } from './converter';
import { createUserGroupEntityIdentifier } from '../user-group/converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';

export function createUserGroupUserRelationship(
  userGroup: Entity,
  user: Entity,
): Relationship {
  return createDirectRelationship({
    _class: RelationshipClass.HAS,
    from: userGroup,
    to: user,
  });
}

export async function fetchUsers({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;

  const convertedUsers: Entity[] = [];
  const relationships: Relationship[] = [];
  await client.iterateUsers((user) => {
    const userEntity = createUserEntity(user);
    convertedUsers.push(userEntity);
    relationships.push(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: userEntity,
      }),
    );
  });
  await jobState.addEntities(convertedUsers);
  await jobState.addRelationships(relationships);
}

export async function buildUserGroupUserRelationships({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);
  await jobState.iterateEntities(
    { _type: Entities.USER._type },
    async (userEntity) => {
      await client.iterateGroupsAssignedToUser(
        userEntity.login as string,
        async (userGroup) => {
          const userGroupEntityId = createUserGroupEntityIdentifier(
            userGroup.id,
          );
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

export const userSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.USERS,
    name: 'Users',
    entities: [Entities.USER],
    executionHandler: fetchUsers,
    relationships: [Relationships.ACCOUNT_HAS_USER],
    dependsOn: [Steps.ACCOUNT],
  },
  {
    id: Steps.BUILD_USER_GROUP_HAS_USER,
    name: 'Build user group user relationship',
    entities: [],
    executionHandler: buildUserGroupUserRelationships,
    relationships: [Relationships.GROUP_HAS_USER],
    dependsOn: [Steps.USER_GROUPS, Steps.USERS],
  },
];
