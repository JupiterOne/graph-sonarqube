import { GraphObjectSchema } from '@jupiterone/integration-sdk-testing';

export const projectClass = ['Project'];
export const projectSchema: GraphObjectSchema = {
  additionalProperties: false,
  properties: {
    _key: { type: 'string' },
    _class: { const: projectClass },
    _type: { const: 'sonarqube_project' },
    _rawData: { type: 'array', items: { type: 'object' } },
    id: { type: 'string' },
    qualifier: { type: 'string' },
    visibility: { type: 'string' },
    lastAnalysisDate: { type: 'string' },
    revision: { type: 'string' },
    displayName: { type: 'string' },
  },
};
