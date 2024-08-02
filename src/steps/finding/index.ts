import {
  createDirectRelationship,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import {
  DEFAULT_FINDING_INGEST_SINCE_DAYS,
  Entities,
  INGESTION_SOURCE_IDS,
  Relationships,
  Steps,
  V1_SEVERITIES_VALUES,
  V2_SEVERITIES_VALUES,
} from '../constants';
import { createSonarqubeClient } from '../../provider';
import { SonarqubeIntegrationConfig } from '../../types';
import { SonarqubeProject } from '../../provider/types/v1';
import {
  createFindingEntity,
  createFindingEntityIdentifier,
} from './converter';
import { APIVersion } from '../../provider/types/common';
import { createProjectEntityIdentifier } from '../project/converter';

function getFilterParams(
  instanceConfig: SonarqubeIntegrationConfig,
): NodeJS.Dict<string | string[]> {
  const { apiVersion, findingStatus, findingsIngestSinceDays, findingTypes } =
    instanceConfig;

  const filterParams: NodeJS.Dict<string | string[]> = {};

  const statusKey = apiVersion === APIVersion.V1 ? 'status' : 'issueStatuses';
  const typesKey =
    apiVersion === APIVersion.V1 ? 'types' : 'impactSoftwareQualities';

  if (findingStatus) {
    filterParams[statusKey] = findingStatus;
  }
  if (findingTypes) {
    filterParams[typesKey] = findingTypes;
  }

  filterParams['createdInLast'] =
    `${findingsIngestSinceDays || DEFAULT_FINDING_INGEST_SINCE_DAYS}d`;

  return filterParams;
}

export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config, logger);

  const severityList = instance.config.findingSeverities
    ? instance.config.findingSeverities
    : instance.config.apiVersion === APIVersion.V1
      ? V1_SEVERITIES_VALUES
      : V2_SEVERITIES_VALUES;

  const filterParams = getFilterParams(instance.config);

  await jobState.iterateEntities(
    { _type: Entities.PROJECT._type },
    async (projectEntity) => {
      const project = getRawData<SonarqubeProject>(projectEntity);

      if (!project) {
        logger.warn(`Can not get raw data for entity ${projectEntity._key}`);
        return;
      }

      // We need to further filter our API calls in order to minimize the chances
      // we'll hit the 10,000 limit impose by the API.  We're currently filtering
      // by project and severity.
      for (const severity of severityList) {
        if (instance.config.apiVersion == APIVersion.V1) {
          filterParams['severities'] = severity;
        } else {
          filterParams['impactSeverities'] = severity;
        }

        await client.iterateProjectFindings(
          async (finding) => {
            const findingEntity = createFindingEntity(finding);

            if (!jobState.hasKey(findingEntity._key)) {
              await jobState.addEntity(findingEntity);
            }

            if (
              !jobState.hasKey(
                `${createProjectEntityIdentifier(
                  project.key,
                )}|has|${createFindingEntityIdentifier(finding.key)}`,
              )
            ) {
              await jobState.addRelationship(
                createDirectRelationship({
                  _class: RelationshipClass.HAS,
                  from: projectEntity,
                  to: findingEntity,
                }),
              );
            }
          },
          { componentKeys: project.key, ...filterParams },
        );
      }
    },
  );
}

export const findingSteps: IntegrationStep<SonarqubeIntegrationConfig>[] = [
  {
    id: Steps.FINDINGS,
    name: 'Fetch Project Findings',
    ingestionSourceId: INGESTION_SOURCE_IDS.FINDINGS,
    entities: [Entities.FINDING],
    executionHandler: fetchFindings,
    relationships: [Relationships.PROJECT_HAS_FINDING],
    dependsOn: [Steps.PROJECTS],
  },
];
