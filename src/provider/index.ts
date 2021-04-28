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
