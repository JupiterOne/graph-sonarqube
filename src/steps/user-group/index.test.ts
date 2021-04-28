import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { fetchUserGroups } from '.';

describe('#fetchUserGroups', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'fetchUserGroupsShouldCollectData',
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
    await fetchUserGroups(context);

    expect(context.jobState.collectedEntities).toHaveLength(2);
    expect(context.jobState.collectedRelationships).toHaveLength(0);
    expect(context.jobState.collectedEntities).toEqual([
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['UserGroup'],
        _type: 'sonarqube_user_group',
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        membersCount: expect.any(Number),
        default: expect.any(Boolean),
      }),
      expect.objectContaining({
        _key: expect.any(String),
        _class: ['UserGroup'],
        _type: 'sonarqube_user_group',
        id: expect.any(String),
        name: expect.any(String),
        description: expect.any(String),
        membersCount: expect.any(Number),
        default: expect.any(Boolean),
      }),
    ]);
  });
});
