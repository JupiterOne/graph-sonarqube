import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupSonarqubeRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe(Steps.FINDINGS, () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });
  test('should fetch findings', async () => {
    recording = setupSonarqubeRecording({
      directory: __dirname,
      name: Steps.FINDINGS,
    });

    const stepConfig = buildStepTestConfigForStep(Steps.FINDINGS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
