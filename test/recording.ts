import {
  setupRecording,
  Recording,
  SetupRecordingInput,
  mutations,
} from '@jupiterone/integration-sdk-testing';

export { Recording };

export function setupSonarqubeRecording(
  input: Omit<SetupRecordingInput, 'mutateEntry'>,
): Recording {
  return setupRecording({
    ...input,
    options: {
      matchRequestsBy: {
        url: {
          hostname: false,
        },
      },
      recordFailedRequests: true,
    },
    redactedRequestHeaders: ['Authorization'],
    mutateEntry: mutations.unzipGzippedRecordingEntry,
  });
}
