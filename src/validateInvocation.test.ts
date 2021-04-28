import { IntegrationValidationError } from '@jupiterone/integration-sdk-core';
import {
  createMockExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';

import { SonarqubeIntegrationConfig } from './types';
import validateInvocation from './validateInvocation';

describe('#validateInvocation', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should requires valid config', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'validateInvocationShouldRequireValidConfig',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext<
      SonarqubeIntegrationConfig
    >({
      instanceConfig: {} as SonarqubeIntegrationConfig,
    });

    await expect(validateInvocation(executionContext)).rejects.toThrowError(
      IntegrationValidationError,
    );
  });

  test('should require a valid api token', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'validateInvocationShouldRequireAValidAPIToken',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext<
      SonarqubeIntegrationConfig
    >({
      instanceConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:9000',
        apiToken: 'INVALID',
      },
    });

    await expect(validateInvocation(executionContext)).rejects.toThrowError(
      IntegrationValidationError,
    );
  });

  test('should require a valid base url', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'validateInvocationShouldRequireAValidBaseUrl',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: true,
      },
    });

    const executionContext = createMockExecutionContext<
      SonarqubeIntegrationConfig
    >({
      instanceConfig: {
        baseUrl: 'http://example.com',
        apiToken: process.env.API_TOKEN || 'string-value',
      },
    });

    await expect(validateInvocation(executionContext)).rejects.toThrowError(
      IntegrationValidationError,
    );
  });
});
