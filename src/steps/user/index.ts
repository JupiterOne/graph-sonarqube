import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Entities, Steps, Relationships } from '../constants';
import { SonarqubeIntegrationConfig } from '../../types';
import { APIVersion } from '../../provider/types/common';
import {
  buildUserGroupUserRelationshipsV1,
  fetchUsersV1,
} from './fetch-users-api-v1';
import {
  buildUserGroupUserRelationshipsV2,
  fetchUsersV2,
} from './fetch-users-api-v2v2';

const fetchUsersFnMap = {
  [APIVersion.V1]: fetchUsersV1,
  [APIVersion.V2]: fetchUsersV2,
};

const buildUserGroupUserRelationshipsFnMap = {
  [APIVersion.V1]: buildUserGroupUserRelationshipsV1,
  [APIVersion.V2]: buildUserGroupUserRelationshipsV2,
};

async function fetchUsers(
  executionContext: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
) {
  await fetchUsersFnMap[executionContext.instance.config.apiVersion](
    executionContext,
  );
}

async function buildUserGroupUserRelationships(
  executionContext: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
) {
  await buildUserGroupUserRelationshipsFnMap[
    executionContext.instance.config.apiVersion
  ](executionContext);
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
