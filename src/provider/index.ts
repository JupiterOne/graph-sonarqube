import { SonarqubeClient } from './SonarqubeClient';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';

type SonarqubeClientConfig = {
  baseUrl: string;
  apiToken: string;
};

export function createSonarqubeClient(
  config: SonarqubeClientConfig,
  logger: IntegrationLogger,
): SonarqubeClient {
  return new SonarqubeClient(config.baseUrl, config.apiToken, logger);
}
