import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SonarqubeProject } from '../../provider/types';

export function createProjectEntity(project: SonarqubeProject): Entity {
  return createIntegrationEntity({
    entityData: {
      source: project,
      assign: {
        _key: project.key,
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
