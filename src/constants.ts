import { RelationshipClass } from '@jupiterone/integration-sdk-core';

export const Steps = {
  PROJECTS: 'fetch-projects',
};

export const Entities = {
  PROJECT: {
    resourceName: 'Project',
    _type: 'sonarqube_project',
    _class: ['Project'],
  },
  REPOSITORY: {
    resourceName: 'Repository',
    _type: 'sonarqube_repository',
    _class: ['CodeRepo'],
  },
};

export const Relationships = {
  PROJECT_SCANS_REPOSITORY: {
    _type: 'sonarqube_project_scans_repository',
    sourceType: Entities.PROJECT._type,
    _class: RelationshipClass.SCANS,
    targetType: Entities.REPOSITORY._type,
  },
};
