import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { createSonarqubeClient } from './provider/index';
import { SonarqubeIntegrationConfig } from './types';
import { SonarqubeSystemInfo } from './provider/types/v1';
import { APIVersion } from './provider/types/common';

function getApiVersion(systemInfo: SonarqubeSystemInfo): APIVersion {
  const INITIAL_SONARQUBE_WITH_API_V2 = '10.4';
  const [major1, minor1] = systemInfo.System.Version.split('.').map(Number);
  const [major2, minor2] = INITIAL_SONARQUBE_WITH_API_V2.split('.').map(Number);
  const shouldUseV1 = major1 < major2 || (major1 === major2 && minor1 < minor2);
  return shouldUseV1 ? APIVersion.V1 : APIVersion.V2;
}

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
    const systemInfo = await client.fetchSystemInfo();
    config.apiVersion = getApiVersion(systemInfo);

    const resp = await client.fetchAuthenticationValidate();
    if (!resp.valid) {
      throw new IntegrationValidationError(
        'Integration configration credentials marked invalid by Sonarqube',
      );
    }
  } catch (e) {
    logger.info({ e }, 'Error while validating the instance configuration');
    throw new IntegrationValidationError(
      'Could not verify credentials against provided Sonarqube baseUrl',
    );
  }
}
