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
};

export default instanceConfigFields;
