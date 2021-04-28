import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import {
  createMockStepExecutionContext,
  mutations,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';

import { createSonarqubeClient } from '.';
import { SonarqubeProject } from './types';

describe('#iterateProjects', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should fail with invalid token', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'iterateProjectsShouldFailWithInvalidToken',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: true,
      },
      mutateEntry: mutations.unzipGzippedRecordingEntry,
    });

    const context = createMockStepExecutionContext({
      instanceConfig: {
        baseUrl: 'http://localhost:9000',
        apiToken: 'string-value',
      },
    });
    const provider = createSonarqubeClient(context.instance.config);
    await expect(
      provider.iterateProjects(() => {
        // do nothing
      }),
    ).rejects.toThrowError(IntegrationProviderAuthenticationError);
  });

  test('should fetch projects with valid config', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'iterateProjectsShouldFetchProjectsWithValidConfig',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
        recordFailedRequests: true,
      },
      mutateEntry: mutations.unzipGzippedRecordingEntry,
    });

    const context = createMockStepExecutionContext({
      instanceConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:9000',
        apiToken: process.env.API_TOKEN || 'string-value',
      },
    });
    const provider = createSonarqubeClient(context.instance.config);

    const results: SonarqubeProject[] = [];
    await provider.iterateProjects((project) => {
      results.push(project);
    });

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          key: expect.any(String),
          name: expect.any(String),
          qualifier: expect.any(String),
          revision: expect.any(String),
          visibility: expect.any(String),
          lastAnalysisDate: expect.any(String),
        }),
      ]),
    );
  });
});
