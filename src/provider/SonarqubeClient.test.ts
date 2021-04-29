import { IntegrationProviderAuthenticationError } from '@jupiterone/integration-sdk-core';
import {
  createMockStepExecutionContext,
  mutations,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';

import { createSonarqubeClient } from '.';
import { SonarqubeProject, SonarqubeUserGroup, SonarqubeUser } from './types';

describe('#iterateResources', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should fail with invalid token', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'iterateResourcesShouldFailWithInvalidToken',
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

  test('should paginate correctly', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'iterateResourcesShouldPaginateCorrectly',
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
    await provider.iterateProjects(
      (project) => {
        results.push(project);
      },
      { ps: '1' },
    );
    expect(results).toHaveLength(2);
  });
});

describe('#iterateProjects', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
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

describe('#iterateUserGroups', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should fetch user groups with valid config', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'iterateUserGroupsShouldFetchUserGroupsWithValidConfig',
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

    const results: SonarqubeUserGroup[] = [];
    await provider.iterateUserGroups((userGroup) => {
      results.push(userGroup);
    });

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: expect.any(String),
          name: expect.any(String),
          description: expect.any(String),
          membersCount: expect.any(Number),
          default: expect.any(Boolean),
        }),
      ]),
    );
  });
});

describe('#iterateUsers', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should fetch users with valid config', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'iterateUsersShouldFetchUsersWithValidConfig',
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

    const results: SonarqubeUser[] = [];
    await provider.iterateUsers((user) => {
      results.push(user);
    });

    expect(results).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          login: expect.any(String),
          name: expect.any(String),
          active: expect.any(Boolean),
          email: expect.any(String),
          groups: expect.any(Array),
          tokensCount: expect.any(Number),
          local: expect.any(Boolean),
          externalIdentity: expect.any(String),
          externalProvider: expect.any(String),
          avatar: expect.any(String),
        }),
        expect.objectContaining({
          login: expect.any(String),
          name: expect.any(String),
          active: expect.any(Boolean),
          email: expect.any(String),
          groups: expect.any(Array),
          tokensCount: expect.any(Number),
          local: expect.any(Boolean),
          externalIdentity: expect.any(String),
          externalProvider: expect.any(String),
          avatar: expect.any(String),
        }),
      ]),
    );
  });
});
