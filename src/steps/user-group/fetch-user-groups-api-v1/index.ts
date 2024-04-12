import { IntegrationStepExecutionContext } from '@jupiterone/integration-sdk-core';

import { createUserGroupEntity } from './converter';
import { createSonarqubeClient } from '../../../provider';
import { buildAccountRelationship } from '../../utils';
import { SonarqubeIntegrationConfig } from '../../../types';

export async function fetchUserGroupsV1(
  executionContext: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
) {
  const { instance, jobState, logger } = executionContext;
  const client = createSonarqubeClient(instance.config, logger);

  await client.iterateUserGroupsV1(async (userGroup) => {
    const userGroupEntity = await jobState.addEntity(
      createUserGroupEntity(userGroup),
    );

    const accountHasUserGroupRelationship = buildAccountRelationship(
      executionContext,
      userGroupEntity._key,
      userGroupEntity._type,
    );
    if (accountHasUserGroupRelationship) {
      await jobState.addRelationship(accountHasUserGroupRelationship);
    }
  });
}
