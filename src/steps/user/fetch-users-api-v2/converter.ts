import {
  createIntegrationEntity,
  Entity,
  parseTimePropertyValue,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../../constants';
import { SonarqubeUserV2 } from '../../../provider/types/v2';

export function getUserV2EntityKey(userId: string): string {
  return `sonarqube-user:${userId}`;
}

export function createUserV2Entity(user: SonarqubeUserV2): Entity | undefined {
  if (!user.id) {
    return;
  }

  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: getUserV2EntityKey(user.id),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        username: user.login,
        shortLoginId: user.login,
        name: user.name,
        login: user.login,
        active: user.active,
        local: user.local,
        managed: user.managed,
        externalLogin: user.externalLogin,
        externalProvider: user.externalProvider,
        avatar: user.avatar,
        sonarQubeLastConnectionOn: parseTimePropertyValue(
          user.sonarQubeLastConnectionDate,
        ),
        sonarLintLastConnectionOn: parseTimePropertyValue(
          user.sonarLintLastConnectionDate,
        ),
        ...(user.email ? { email: user.email } : {}),
      },
    },
  });
}
