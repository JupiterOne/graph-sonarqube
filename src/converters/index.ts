import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SonarqubeProject } from '../provider/types';

export function createProjectEntity(project: SonarqubeProject): Entity {
  const key = createProjectEntityIdentifier(project.key);

  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _key: key,
        _type: Entities.PROJECT._type,
        _class: Entities.PROJECT._class,
        id: project.key,
        name: project.name,
        qualifier: project.qualifier,
        visibility: project.visibility,
        lastAnalysisDate: project.lastAnalysisDate,
        revision: project.revision,
      },
    },
  });
}

const PROJECT_KEY_PREFIX = 'sonarqube-project';
export function createProjectEntityIdentifier(key: string): string {
  return `${PROJECT_KEY_PREFIX}:${key}`;
}
