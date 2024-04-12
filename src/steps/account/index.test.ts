import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { fetchAccount } from '.';
import { APIVersion } from '../../provider/types/common';

describe('#fetchAccount', () => {
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
        apiVersion: APIVersion.V1,
      },
    });
    await fetchAccount(context);

    expect(context.jobState.collectedEntities).toHaveLength(1);
    expect(context.jobState.collectedRelationships).toHaveLength(0);
    expect(context.jobState.collectedEntities).toMatchGraphObjectSchema({
      _class: ['Account'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'sonarqube_account' },
          _key: { type: 'string' },
          name: { type: 'string' },
          id: { type: 'string' },
        },
      },
    });
  });
});
