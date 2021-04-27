import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

import step from '../';
import { createProjectEntity } from '../../../converters';
import { Recording, setupRecording } from '../../../../test';
import { createSonarqubeClient } from '../../../provider';
import { SonarqubeProject } from '../../../provider/types';

let recording: Recording;

beforeEach(() => {
  recording = setupRecording({
    directory: __dirname,
    name: 'projects',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('Account fetching', async () => {
  const context = createMockStepExecutionContext({
    instanceConfig: {
      baseUrl: process.env.BASE_URL || 'http://localhost:9000',
      apiToken: process.env.API_TOKEN || 'string-value',
    },
  });
  const provider = createSonarqubeClient(context.instance.config);

  const results: SonarqubeProject[] = [];
  await provider.iterateProjects((project) => {
    results.push(project);
  });

  expect(results).toEqual(
    expect.arrayContaining([
      expect.objectContaining({
        key: expect.any(String),
        name: expect.any(String),
        qualifier: expect.any(String),
        revision: expect.any(String),
        visibility: expect.any(String),
        lastAnalysisDate: expect.any(String),
      }),
    ]),
  );
});

test('Account entity conversion', () => {
  const project = {
    key: 'project-key-1',
    name: 'Project Name 1',
    qualifier: 'TRK',
    visibility: 'public',
    lastAnalysisDate: '2017-03-01T11:39:03+0300',
    revision: 'cfb82f55c6ef32e61828c4cb3db2da12795fd767',
  } as SonarqubeProject;

  const entity = createProjectEntity(project);

  expect(entity).toEqual(
    expect.objectContaining({
      _key: 'sonarqube-project:project-key-1',
      _type: 'sonarqube_project',
      _class: ['Project'],
      key: 'project-key-1',
      name: 'Project Name 1',
      qualifier: 'TRK',
      visibility: 'public',
      lastAnalysisDate: '2017-03-01T11:39:03+0300',
      revision: 'cfb82f55c6ef32e61828c4cb3db2da12795fd767',
      _rawData: [
        {
          name: 'default',
          rawData: project,
        },
      ],
    }),
  );
});

test('step data collection', async () => {
  const context = createMockStepExecutionContext({
    instanceConfig: {
      baseUrl: process.env.BASE_URL || 'http://localhost:9000',
      apiToken: process.env.API_TOKEN || 'string-value',
    },
  });
  await step.executionHandler(context);

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
