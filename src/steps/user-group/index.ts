import {
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { APIVersion } from '../../provider/types/common';
import { fetchUserGroupsV1 } from './fetch-user-groups-api-v1';
import { fetchUserGroupsV2 } from './fetch-user-groups-api-v2';
import { SonarqubeIntegrationConfig } from '../../types';
import {
  Steps,
  Entities,
  Relationships,
  INGESTION_SOURCE_IDS,
} from '../constants';

const fetchUserGroupsFnMap = {
  [APIVersion.V1]: fetchUserGroupsV1,
  [APIVersion.V2]: fetchUserGroupsV2,
};

async function fetchUserGroups(
  executionContext: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
) {
  await fetchUserGroupsFnMap[executionContext.instance.config.apiVersion](
    executionContext,
  );
}

export const userGroupSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.USER_GROUPS,
    name: 'User Groups',
    entities: [Entities.USER_GROUP],
    ingestionSourceId: INGESTION_SOURCE_IDS.USER_GROUPS,
    executionHandler: fetchUserGroups,
    relationships: [Relationships.ACCOUNT_HAS_USER_GROUP],
    dependsOn: [Steps.ACCOUNT],
  },
];
