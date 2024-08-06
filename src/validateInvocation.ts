import {
  IntegrationExecutionContext,
  IntegrationValidationError,
} from '@jupiterone/integration-sdk-core';

import { createSonarqubeClient } from './provider/index';
import { SonarqubeIntegrationConfig } from './types';
import { SonarqubeSystemInfo } from './provider/types/v1';
import { APIVersion } from './provider/types/common';
import {
  FINDING_STATUSES,
  FINDING_TYPES,
  FINDINGS_SEVERITIES,
} from './steps/constants';

function getApiVersion(systemInfo: SonarqubeSystemInfo): APIVersion {
  const INITIAL_SONARQUBE_WITH_API_V2 = '10.4';
  const [major1, minor1] = systemInfo.System.Version.split('.').map(Number);
  const [major2, minor2] = INITIAL_SONARQUBE_WITH_API_V2.split('.').map(Number);
  const shouldUseV1 = major1 < major2 || (major1 === major2 && minor1 < minor2);
  return shouldUseV1 ? APIVersion.V1 : APIVersion.V2;
}

function validSeverities(severities: string[]) {
  return severities.every((severity) =>
    ['INFO', 'MINOR', 'MAJOR', 'CRITICAL', 'BLOCKER'].includes(severity),
  );
}

function validStatuses(statuses: string[]) {
  return statuses.every((status) =>
    ['OPEN', 'CONFIRMED', 'REOPENED', 'RESOLVED', 'CLOSED'].includes(status),
  );
}

function validTypes(types: string[]) {
  return types.every((type) =>
    ['CODE_SMELL', 'BUG', 'VULNERABILITY'].includes(type),
  );
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

  if (config.findingsIngestSinceDays !== undefined && isNaN(Number(config.findingsIngestSinceDays))) {
    throw new IntegrationValidationError(`FINDINGS_INGEST_SINCE_DAYS must be a number if defined. Received: ${config.findingsIngestSinceDays}`);
}

  const client = createSonarqubeClient(instance.config, logger);
  try {
    const systemInfo = await client.fetchSystemInfo();
    config.apiVersion = getApiVersion(systemInfo);

    if (config.findingSeverities) {
      const findingSeverities = (config.findingSeverities as unknown as string)
        .split(',')
        .map((s) => s.trim());
      if (!validSeverities(findingSeverities)) {
        throw new IntegrationValidationError(
          'Invalid Finding severities. Valid severities are INFO, MINOR, MAJOR, CRITICAL, BLOCKER',
        );
      }

      if (config.apiVersion == APIVersion.V1) {
        config.findingSeverities = findingSeverities;
      } else {
        const findingSeveritiesSet = new Set(
          findingSeverities.map(
            (findingSeverity) => FINDINGS_SEVERITIES[findingSeverity],
          ),
        );
        config.findingSeverities = Array.from(findingSeveritiesSet);
      }
    }

    if (config.findingStatus) {
      const findingStatus = (config.findingStatus as unknown as string)
        .split(',')
        .map((s) => s.trim());
      if (!validStatuses(findingStatus)) {
        throw new IntegrationValidationError(
          'Invalid Finding Status. Valid statuses are OPEN, CONFIRMED, REOPENED, RESOLVED, CLOSED',
        );
      }

      if (config.apiVersion == APIVersion.V1) {
        config.findingStatus = findingStatus;
      } else {
        const findingStatusSet = new Set(
          findingStatus.map((findingStatus) => FINDING_STATUSES[findingStatus]),
        );
        config.findingStatus = Array.from(findingStatusSet);
      }
    }

    if (config.findingTypes) {
      const findingTypes = (config.findingTypes as unknown as string)
        .split(',')
        .map((s) => s.trim());
      if (!validTypes(findingTypes)) {
        throw new IntegrationValidationError(
          'Invalid vulnerability severities. Valid types are CODE_SMELL,BUG,VULNERABILITY',
        );
      }

      if (config.apiVersion == APIVersion.V1) {
        config.findingTypes = findingTypes;
      } else {
        const findingTypesSet = new Set(
          findingTypes.map((findingType) => FINDING_TYPES[findingType]),
        );
        config.findingTypes = Array.from(findingTypesSet);
      }
    }

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
