import {
  Recording,
  executeStepWithDependencies,
} from '@jupiterone/integration-sdk-testing';
import { Steps } from '../constants';
import { buildStepTestConfigForStep } from '../../../test/config';
import { setupSonarqubeRecording } from '../../../test/recording';

describe(Steps.USERS, () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });
  test('should fetch users', async () => {
    recording = setupSonarqubeRecording({
      directory: __dirname,
      name: Steps.USERS,
    });

    const stepConfig = buildStepTestConfigForStep(Steps.USERS);
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});

describe(Steps.BUILD_USER_GROUP_HAS_USER, () => {
  let recording: Recording;
  afterEach(async () => {
    if (recording) {
      await recording.stop();
    }
  });
  test('should build user group user relationships', async () => {
    recording = setupSonarqubeRecording({
      directory: __dirname,
      name: Steps.BUILD_USER_GROUP_HAS_USER,
    });

    const stepConfig = buildStepTestConfigForStep(
      Steps.BUILD_USER_GROUP_HAS_USER,
    );
    const stepResults = await executeStepWithDependencies(stepConfig);
    expect(stepResults).toMatchStepMetadata(stepConfig);
  });
});
