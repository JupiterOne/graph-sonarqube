import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Entities, Steps } from '../constants';
import { createProjectEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchProjects({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);

  const convertedProjects: Entity[] = [];
  await client.iterateProjects(async (project) => {
    convertedProjects.push(createProjectEntity(project));
  });
  await jobState.addEntities(convertedProjects);
}

export const projectSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.PROJECTS,
    name: 'Projects',
    entities: [Entities.PROJECT],
    executionHandler: fetchProjects,
    relationships: [],
  },
];
