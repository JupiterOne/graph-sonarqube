import { IntegrationStepExecutionContext } from '@jupiterone/integration-sdk-core';

import { createUserGroupV2Entity } from './converter';
import { createSonarqubeClient } from '../../../provider';
import { buildAccountRelationship } from '../../utils';
import { SonarqubeIntegrationConfig } from '../../../types';

export async function fetchUserGroupsV2(
  executionContext: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
) {
  const { instance, jobState, logger } = executionContext;
  const client = createSonarqubeClient(instance.config, logger);

  await client.iterateUserGroupsV2(async (userGroup) => {
    const userGroupEntity = createUserGroupV2Entity(userGroup);
    if (userGroupEntity) {
      await jobState.addEntity(userGroupEntity);
      const accountHasUserGroupRelationship = buildAccountRelationship(
        executionContext,
        userGroupEntity._key,
        userGroupEntity._type,
      );
      if (accountHasUserGroupRelationship) {
        await jobState.addRelationship(accountHasUserGroupRelationship);
      }
    }
  });
}
