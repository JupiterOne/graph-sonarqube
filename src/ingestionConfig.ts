import { IntegrationIngestionConfigFieldMap } from '@jupiterone/integration-sdk-core';
import { INGESTION_SOURCE_IDS } from './steps/constants';

export const ingestionConfig: IntegrationIngestionConfigFieldMap = {
  [INGESTION_SOURCE_IDS.FINDINGS]: {
    title: 'Users',
    description: 'SonarQube Issues',
    defaultsToDisabled: false,
  },
  [INGESTION_SOURCE_IDS.USERS]: {
    title: 'Users',
    description: 'SonarQube Users',
    defaultsToDisabled: false,
  },
  [INGESTION_SOURCE_IDS.PROJECT]: {
    title: 'Projects',
    description: 'SonarQube Projects',
    defaultsToDisabled: false,
  },
  [INGESTION_SOURCE_IDS.USER_GROUPS]: {
    title: 'User Groups',
    description: 'SonarQube Groups',
    defaultsToDisabled: false,
  },
};
