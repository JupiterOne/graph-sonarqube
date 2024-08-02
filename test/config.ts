import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { SonarqubeIntegrationConfig } from '../src/types';
import { APIVersion } from '../src/provider/types/common';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}

const DEFAULT_API_TOKEN = 'dummy-sonarqube-api-token';
const DEFAULT_BASE_URL = 'http://127.0.0.1:9000';
const DEFAULT_API_VERSION = APIVersion.V2;
const DEFAULT_CREATED_IN_LAST = 90;

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  const integrationConfig: SonarqubeIntegrationConfig = {
    apiToken: process.env.API_TOKEN || DEFAULT_API_TOKEN,
    baseUrl: process.env.BASE_URL || DEFAULT_BASE_URL,
    // Using env var to determine version since we don't want to query the system info when running a test
    apiVersion: (process.env.API_VERSION as APIVersion) || DEFAULT_API_VERSION,
    findingsIngestSinceDays:
      process.env.CREATED_IN_LAST ? + process.env.CREATED_IN_LAST : DEFAULT_CREATED_IN_LAST,
  };

  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
