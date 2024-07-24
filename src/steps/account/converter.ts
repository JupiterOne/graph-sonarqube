import {
  createIntegrationEntity,
  Entity,
  IntegrationInstance,
} from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../types';

import { Entities } from '../constants';

export function getAccountEntityKey(instanceId: string): string {
  return `${Entities.ACCOUNT._type}:${instanceId}`;
}

export function createAccountEntity(
  instance: IntegrationInstance<SonarqubeIntegrationConfig>,
): Entity {
  const { id, name } = instance;
  return createIntegrationEntity({
    entityData: {
      source: {
        name,
      },
      assign: {
        _key: getAccountEntityKey(id),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id,
        name,
        vendor: 'SonarQube'
      },
    },
  });
}
