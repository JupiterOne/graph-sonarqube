import {
  createDirectRelationship,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import { Entities, Relationships, Steps } from '../constants';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';
import { SonarqubeProject } from '../../provider/types';
import { createFindingEntity } from './converter';

export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config, logger);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      const project = getRawData<SonarqubeProject>(projectEntity);

      if (!project) {
        logger.warn(`Can not get raw data for entity ${projectEntity._key}`);
        return;
      }

      await client.iterateProjectFindings(
        async (finding) => {
          const findingEntity = createFindingEntity(finding);

          if (!(await jobState.hasKey(findingEntity._key))) {
            await jobState.addEntity(findingEntity);
          }

          await jobState.addRelationship(
            createDirectRelationship({
              _class: RelationshipClass.HAS,
              from: projectEntity,
              to: findingEntity,
            }),
          );
        },
        { componentKeys: project.key },
      );
    },
  );
}

export const findingSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.FINDINGS,
    name: 'Fetch Project Findings',
    entities: [Entities.FINDING],
    executionHandler: fetchFindings,
    relationships: [Relationships.PROJECT_HAS_FINDING],
    dependsOn: [Steps.PROJECTS],
  },
];
