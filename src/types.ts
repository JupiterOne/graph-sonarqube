import { IntegrationInstanceConfig } from '@jupiterone/integration-sdk-core';

export interface SonarqubeIntegrationConfig extends IntegrationInstanceConfig {
  baseUrl: string;
  apiToken: string;
}
