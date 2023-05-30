import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { createSonarqubeClient } from './provider/index';
import { SonarqubeIntegrationConfig } from './types';

export default async function validateInvocation({
  instance,
  logger,
}: IntegrationExecutionContext<SonarqubeIntegrationConfig>): Promise<void> {
  const config = instance.config;

  if (!config.baseUrl || !config.apiToken) {
    throw new IntegrationValidationError(
      'Integration configuration requires all of {baseUrl, apiToken}',
    );
  }

  if (config.baseUrl.endsWith('/')) {
    config.baseUrl = config.baseUrl.slice(0, -1);
  }

  const client = createSonarqubeClient(instance.config, logger);
  try {
    const resp = await client.fetchAuthenticationValidate();
    if (!resp.valid) {
      throw new IntegrationValidationError(
        'Integration configration credentials marked invalid by Sonarqube',
      );
    }
  } catch {
    throw new IntegrationValidationError(
      'Could not verify credentials against provided Sonarqube baseUrl',
    );
  }
}
