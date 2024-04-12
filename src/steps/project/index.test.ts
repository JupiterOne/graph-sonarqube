import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupSonarqubeRecording } from '../../../test/recording';
import { Steps } from '../constants';

describe(Steps.PROJECTS, () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });
  test('should fetch projects', async () => {
    recording = setupSonarqubeRecording({
      directory: __dirname,
      name: Steps.PROJECTS,
    });

    const stepConfig = buildStepTestConfigForStep(Steps.PROJECTS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
