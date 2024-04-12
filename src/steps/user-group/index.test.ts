import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupSonarqubeRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe(Steps.USER_GROUPS, () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });
  test('should fetch user groups', async () => {
    recording = setupSonarqubeRecording({
      directory: __dirname,
      name: Steps.USER_GROUPS,
    });

    const stepConfig = buildStepTestConfigForStep(Steps.USER_GROUPS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
