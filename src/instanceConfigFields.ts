import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  baseUrl: {
    type: 'string',
  },
  apiToken: {
    type: 'string',
    mask: true,
  },
  enableFindingsIngestion: {
    type: 'boolean',
    mask: false,
    optional: true,
  },
  severities: {
    type: 'string',
    mask: false,
    optional: true,
  },
  status: {
    type: 'string',
    mask: false,
    optional: true,
  },
  createdInLast: {
    type: 'string',
    mask: false,
    optional: true,
  },
  types: {
    type: 'string',
    mask: false,
    optional: true,
  },
};

export default instanceConfigFields;
