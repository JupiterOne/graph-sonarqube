import { RelationshipClass } from '@jupiterone/integration-sdk-core';
import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
} from '@jupiterone/integration-sdk-testing';
import { buildUserGroupUserRelationships, fetchUsers } from '.';
import { fetchUserGroups } from '../user-group';
import { Relationships } from '../constants';
import { fetchAccount } from '../account';

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

    await fetchAccount(context);
    await fetchUsers(context);

    expect(context.jobState.collectedEntities.length).toBeGreaterThan(0);
    expect(context.jobState.collectedRelationships.length).toBeGreaterThan(0);

    const userEntities = context.jobState.collectedEntities.filter(
      (p) => p._type === 'sonarqube_user',
    );

    expect(userEntities).toMatchGraphObjectSchema({
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

describe('#buildUserGroupUserRelationships', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'buildUserGroupUserRelationshipsShouldCollectData',
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
    await fetchUsers(context);
    await fetchUserGroups(context);
    await buildUserGroupUserRelationships(context);

    const userUserGroupRelationships = context.jobState.collectedRelationships.filter(
      (r) => r._type === Relationships.GROUP_HAS_USER._type,
    );

    expect(userUserGroupRelationships.length).toBeGreaterThan(0);
    expect(userUserGroupRelationships).toMatchDirectRelationshipSchema({
      schema: {
        properties: {
          _class: { const: RelationshipClass.HAS },
          _type: { const: Relationships.GROUP_HAS_USER._type },
        },
      },
    });
  });
});
