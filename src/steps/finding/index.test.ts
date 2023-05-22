import {
  createMockStepExecutionContext,
  Recording,
  setupRecording,
  mutations,
} from '@jupiterone/integration-sdk-testing';
import { fetchFindings } from '.';
import { fetchAccount } from '../account';
import { fetchProjects } from '../project';

describe('#fetchFindings', () => {
  let recording: Recording;

  afterEach(async () => {
    await recording.stop();
  });

  test('should collect data', async () => {
    recording = setupRecording({
      directory: __dirname,
      name: 'fetchFindingsShouldCollectData',
      options: {
        matchRequestsBy: {
          url: {
            hostname: false,
          },
        },
      },
      mutateEntry: (entry) => {
        mutations.unzipGzippedRecordingEntry(entry);
      },
    });

    const context = createMockStepExecutionContext({
      instanceConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:9000',
        apiToken: process.env.API_TOKEN || 'string-value',
      },
    });

    await fetchAccount(context);
    await fetchProjects(context);
    await fetchFindings(context);

    const entities = context.jobState.collectedEntities.filter(
      (p) => p._type === 'sonarqube_finding',
    );
    const relationships = context.jobState.collectedRelationships.filter(
      (r) => r._type === 'sonarqube_project_has_finding',
    );

    expect(entities).toMatchGraphObjectSchema({
      _class: ['Finding'],
      schema: {
        additionalProperties: true,
        properties: {
          _type: { const: 'sonarqube_finding' },
          _key: { type: 'string' },
          key: { type: 'string' },
          name: { type: 'string' },
          _rawData: {
            type: 'array',
            items: { type: 'object' },
          },
        },
      },
    });

    expect(entities.length).toBeGreaterThan(0);
    expect(relationships.length).toBeGreaterThan(0);
  });
});
