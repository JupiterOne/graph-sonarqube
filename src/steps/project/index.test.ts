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

    expect(context.jobState.collectedEntities).toHaveLength(2);
    expect(context.jobState.collectedRelationships).toHaveLength(0);
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['Project'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'sonarqube_project' },
          _key: { type: 'string' },
          key: { type: 'string' },
          name: { type: 'string' },
          qualifier: { type: 'string' },
          revision: { type: 'string' },
          visibility: { type: 'string' },
          lastAnalysisDate: { type: 'string' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
        required: ['name'],
      },
    });
  });
});
