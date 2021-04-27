import {
  createMockStepExecutionContext,
  GraphObjectSchema,
  MockJobState,
} from '@jupiterone/integration-sdk-testing';

import { Recording, setupRecording } from '../../test';
import { projectClass, projectSchema } from '../../test/schemas';
import { fetchProjects } from './fetch-projects';

let recording: Recording;

afterEach(async () => {
  await recording.stop();
});

test('collect', async () => {
  recording = setupRecording({
    directory: __dirname,
    name: 'collect',
  });

  const context = createMockStepExecutionContext({
    instanceConfig: {
      baseUrl: process.env.BASE_URL || 'http://localhost:9000',
      apiToken: process.env.API_TOKEN || 'string-value',
    },
  });

  await fetchProjects(context);

  verifyCollectedEntities(context.jobState, projectClass, projectSchema);
});

function verifyCollectedEntities(
  jobState: MockJobState,
  _class: string[],
  schema: GraphObjectSchema,
): void {
  const entities = jobState.collectedEntities.filter((e) => {
    const entityClass = Array.isArray(e._class) ? e._class : Array(e._class);
    return entityClass.sort().every((e) => _class.includes(e));
  });
  expect(entities.length).toBeGreaterThan(0);
  expect(entities).toMatchGraphObjectSchema({
    _class,
    schema,
  });
}
