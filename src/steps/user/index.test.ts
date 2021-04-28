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
    expect(context.jobState.collectedEntities).toEqual([
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['User'],
        _type: 'sonarqube_user',
        username: expect.any(String),
        shortLoginId: expect.any(String),
        name: expect.any(String),
        login: expect.any(String),
        active: expect.any(Boolean),
        tokensCount: expect.any(Number),
        local: expect.any(Boolean),
        externalIdentity: expect.any(String),
        externalProvider: expect.any(String),
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['User'],
        _type: 'sonarqube_user',
        username: expect.any(String),
        email: expect.any(String),
        shortLoginId: expect.any(String),
        name: expect.any(String),
        login: expect.any(String),
        active: expect.any(Boolean),
        tokensCount: expect.any(Number),
        local: expect.any(Boolean),
        externalIdentity: expect.any(String),
        externalProvider: expect.any(String),
      }),
    ]);
  });
});
