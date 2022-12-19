import {
  createIntegrationEntity,
  Entity,
  IntegrationInstance,
} from '@jupiterone/integration-sdk-core';
import { SonarqubeIntegrationConfig } from '../../types';

import { Entities } from '../constants';

export function createAccountEntity(
  instance: IntegrationInstance<SonarqubeIntegrationConfig>,
): Entity {
  const { id, name } = instance;
  return createIntegrationEntity({
    entityData: {
      source: {
        id,
        name,
      },
      assign: {
        _key: 'sonarqube_account',
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
        id,
        name,
      },
    },
  });
}
