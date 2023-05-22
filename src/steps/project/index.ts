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
import { createProjectEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchProjects({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const accountEntity = (await jobState.getData(ACCOUNT_ENTITY_KEY)) as Entity;
  const client = createSonarqubeClient(instance.config, logger);

  const convertedProjects: Entity[] = [];
  const relationships: Relationship[] = [];
  await client.iterateProjects((project) => {
    const projectEntity = createProjectEntity(project);

    convertedProjects.push(projectEntity);
    relationships.push(
      createDirectRelationship({
        _class: RelationshipClass.HAS,
        from: accountEntity,
        to: projectEntity,
      }),
    );
  });
  await jobState.addEntities(convertedProjects);
  await jobState.addRelationships(relationships);
}

export const projectSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.PROJECTS,
    name: 'Projects',
    entities: [Entities.PROJECT],
    executionHandler: fetchProjects,
    relationships: [Relationships.ACCOUNT_HAS_PROJECT],
    dependsOn: [Steps.ACCOUNT],
  },
];
