import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { fetchProjects } from '.';

describe('#fetchProjects', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'fetchProjectsShouldCollectData',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
      },
    });

    const context = createMockStepExecutionContext({
      instanceConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:9000',
        apiToken: process.env.API_TOKEN || 'string-value',
      },
    });
    await fetchProjects(context);

    expect(context.jobState.collectedEntities).toHaveLength(1);
    expect(context.jobState.collectedRelationships).toHaveLength(0);
    expect(context.jobState.collectedEntities).toEqual([
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['Project'],
        _type: 'sonarqube_project',
        key: expect.any(String),
        name: expect.any(String),
        qualifier: expect.any(String),
        revision: expect.any(String),
        visibility: expect.any(String),
        lastAnalysisDate: expect.any(String),
      }),
    ]);
  });
});
