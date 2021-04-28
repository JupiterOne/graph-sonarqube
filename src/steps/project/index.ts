import {
  Entity,
  IntegrationStep,
  IntegrationStepExecutionContext,
} from '@jupiterone/integration-sdk-core';

import { Entities, Steps } from '../constants';
import { createProjectEntity } from './converter';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeProject } from '../../provider/types';
import { SonarqubeIntegrationConfig } from '../../types';

export async function fetchProjects({
  instance,
  jobState,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config);
  const projectKeys = new Set<string>();
  const addProjectEntity = async (
    project: SonarqubeProject,
  ): Promise<Entity> => {
    const projectEntity = createProjectEntity(project);
    if (!projectKeys.has(projectEntity._key)) {
      await jobState.addEntity(projectEntity);
      projectKeys.add(projectEntity._key);
    }
    return projectEntity;
  };

  await client.iterateProjects(async (project) => {
    await addProjectEntity(project);
  });
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
