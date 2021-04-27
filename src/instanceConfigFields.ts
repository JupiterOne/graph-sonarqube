import { IntegrationInstanceConfigFieldMap } from '@jupiterone/integration-sdk-core';

const instanceConfigFields: IntegrationInstanceConfigFieldMap = {
  sonarqubeUserToken: {
    type: 'string',
    mask: true,
  },
};

export default instanceConfigFields;
