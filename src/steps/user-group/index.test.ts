import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { fetchUserGroups } from '.';
import { fetchAccount } from '../account';

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

    await fetchAccount(context);
    await fetchUserGroups(context);

    expect(context.jobState.collectedEntities.length).toBeGreaterThan(0);
    expect(context.jobState.collectedRelationships.length).toBeGreaterThan(0);

    const userGroupEntities = context.jobState.collectedEntities.filter(
      (p) => p._type === 'sonarqube_user_group',
    );

    expect(userGroupEntities).toMatchGraphObjectSchema({
      _class: ['UserGroup'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'sonarqube_user_group' },
          _key: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          description: { type: 'string' },
          membersCount: { type: 'number' },
          default: { type: 'boolean' },
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
