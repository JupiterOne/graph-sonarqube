import { SonarqubeIntegrationConfig } from '../types';
import { SonarqubeClient } from './SonarqubeClient';
import { IntegrationLogger } from '@jupiterone/integration-sdk-core';

export function createSonarqubeClient(
  config: SonarqubeIntegrationConfig,
  logger: IntegrationLogger,
): SonarqubeClient {
  return new SonarqubeClient(config, logger);
}
