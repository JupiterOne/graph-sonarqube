import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SonarqubeProject } from '../../provider/types';

const PROJECT_KEY_PREFIX = 'sonarqube-project';
export function createProjectEntityIdentifier(key: string): string {
  return `${PROJECT_KEY_PREFIX}:${key}`;
}

export function createProjectEntity(project: SonarqubeProject): Entity {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _key: createProjectEntityIdentifier(project.key),
        _type: Entities.PROJECT._type,
        _class: Entities.PROJECT._class,
        id: project.key,
        name: project.name,
        qualifier: project.qualifier,
        visibility: project.visibility,
        lastAnalysisDate: parseTimePropertyValue(project.lastAnalysisDate),
        revision: project.revision,
      },
    },
  });
}
