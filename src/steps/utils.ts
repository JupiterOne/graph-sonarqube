import {
  IntegrationStepExecutionContext,
  RelationshipClass,
  createDirectRelationship,
} from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../types';
import { getAccountEntityKey } from './account/converter';
import { Entities } from './constants';

export function buildAccountRelationship(
  {
    instance,
    jobState,
  }: IntegrationStepExecutionContext<SonarqubeIntegrationConfig>,
  childEntityKey: string,
  childEntityType: string,
  relationshipClass: RelationshipClass = RelationshipClass.HAS,
) {
  const accountEntityKey = getAccountEntityKey(instance.id);
  if (jobState.hasKey(accountEntityKey)) {
    const accountRelationship = createDirectRelationship({
      _class: relationshipClass,
      fromKey: accountEntityKey,
      fromType: Entities.ACCOUNT._type,
      toKey: childEntityKey,
      toType: childEntityType,
    });
    return accountRelationship;
  }
}
