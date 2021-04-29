import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { fetchUsers } from '.';

describe('#fetchUsers', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'fetchUsersShouldCollectData',
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
    await fetchUsers(context);

    expect(context.jobState.collectedEntities).toHaveLength(2);
    expect(context.jobState.collectedRelationships).toHaveLength(0);
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['User'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'sonarqube_user' },
          _key: { type: 'string' },
          username: { type: 'string' },
          shortLoginId: { type: 'string' },
          name: { type: 'string' },
          active: { type: 'boolean' },
          tokensCount: { type: 'number' },
          local: { type: 'boolean' },
          externalIdentity: { type: 'string' },
          externalProvider: { type: 'string' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
        required: ['login'],
      },
    });
  });
});
