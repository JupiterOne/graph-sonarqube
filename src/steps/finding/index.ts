import {
  createDirectRelationship,
  getRawData,
  IntegrationStep,
  IntegrationStepExecutionContext,
  RelationshipClass,
} from '@jupiterone/integration-sdk-core';

import {
  DEFAULT_CREATED_IN_LAST,
  Entities,
  FINDING_STATUSES,
  FINDING_TYPES,
  FINDINGS_SEVERITIES,
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

function getSeverities(instanceConfig: SonarqubeIntegrationConfig) {
  const { severities, apiVersion } = instanceConfig;
  const severitiesSet = new Set(
    severities?.split(',').map((severity) => FINDINGS_SEVERITIES[severity]),
  );

  // V2 -> 10.4 or above version
  if (apiVersion == APIVersion.V1) {
    return severities ? severities.split(',') : V1_SEVERITIES_VALUES;
  }
  return severitiesSet.size === 0
    ? V2_SEVERITIES_VALUES
    : Array.from(severitiesSet);
}

function getFilterParams(
  instanceConfig: SonarqubeIntegrationConfig,
): NodeJS.Dict<string | string[]> {
  const { apiVersion, status, createdInLast, types } = instanceConfig;

  let filterParams: NodeJS.Dict<string | string[]>;

  if (apiVersion === APIVersion.V1) {
    // V1 -> below 10.4 version
    filterParams = {
      status,
      types,
    };
  } else {
    const statusesSet = new Set(
      status?.split(',').map((status) => FINDING_STATUSES[status]),
    );
    const typesSet = new Set(
      types?.split(',').map((type) => FINDING_TYPES[type]),
    );
    filterParams = {
      issueStatuses: Array.from(statusesSet).join(','),
      impactSoftwareQualities: Array.from(typesSet).join(','),
    };
  }
  filterParams['createdInLast'] = createdInLast || DEFAULT_CREATED_IN_LAST;
  return filterParams;
}

export async function fetchFindings({
  instance,
  jobState,
  logger,
}: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>) {
  const client = createSonarqubeClient(instance.config, logger);

  const severities = getSeverities(instance.config);
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
      for (const severity of severities) {
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
