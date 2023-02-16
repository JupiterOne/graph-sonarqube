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
    name: 'fetch-user-groups',
  });
});

afterEach(async () => {
  await recording.stop();
});

test('fetch-user-groups', async () => {
  const stepConfig = buildStepTestConfigForStep('fetch-user-groups');
  const stepResult = await executeStepWithDependencies(stepConfig);
  expect(stepResult).toMatchStepMetadata(stepConfig);
});
