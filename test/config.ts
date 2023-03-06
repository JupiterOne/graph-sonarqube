import { IntegrationInvocationConfig } from '@jupiterone/integration-sdk-core';
import { StepTestConfig } from '@jupiterone/integration-sdk-testing';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { invocationConfig } from '../src';
import { SonarqubeIntegrationConfig } from '../src/types';

if (process.env.LOAD_ENV) {
  dotenv.config({
    path: path.join(__dirname, '../.env'),
  });
}
const DEFAULT_URL = 'http://34.171.196.173:9000';
const DEFAULT_API_TOKEN = 'sonarqube-api-token';

export const integrationConfig: SonarqubeIntegrationConfig = {
  baseUrl: process.env.BASE_URL || DEFAULT_URL,
  apiToken: process.env.API_TOKEN || DEFAULT_API_TOKEN,
};

export function buildStepTestConfigForStep(stepId: string): StepTestConfig {
  return {
    stepId,
    instanceConfig: integrationConfig,
    invocationConfig: invocationConfig as IntegrationInvocationConfig,
  };
}
