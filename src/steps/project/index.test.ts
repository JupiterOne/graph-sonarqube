import {
  executeStepWithDependencies,
  Recording,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupProjectRecording } from '../../../test/recording';

let recording: Recording;
beforeEach(() => {
  recording = setupProjectRecording({
    directory: __dirname,
    name: 'fetch-projects',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('fetch-projects', async () => {
  const stepConfig = buildStepTestConfigForStep('fetch-projects');
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
