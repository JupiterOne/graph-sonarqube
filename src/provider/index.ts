import { IntegrationInstance } from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../types';
import { SonarqubeClient } from './SonarqubeClient';

type SonarqubeClientConfig = {
  baseUrl: string;
  apiToken: string;
};

export function createSonarqubeClient(
  config: SonarqubeClientConfig,
): SonarqubeClient {
  return new SonarqubeClient(config.baseUrl, config.apiToken);
}

export type ClientCreator = (
  client: IntegrationInstance<SonarqubeIntegrationConfig>,
) => SonarqubeClient;
