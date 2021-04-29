import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SonarqubeUser } from '../../provider/types';

const USER_LOGIN_PREFIX = 'sonarqube-user';
export function createUserEntityIdentifier(login: string): string {
  return `${USER_LOGIN_PREFIX}:${login}`;
}

export function createUserEntity(user: SonarqubeUser): Entity {
  return createIntegrationEntity({
    entityData: {
      source: user,
      assign: {
        _key: createUserEntityIdentifier(user.login),
        _type: Entities.USER._type,
        _class: Entities.USER._class,
        username: user.login,
        email: user.email,
        shortLoginId: user.login,
        name: user.name,
        login: user.login,
        active: user.active,
        tokensCount: user.tokensCount,
        local: user.local,
        externalIdentity: user.externalIdentity,
        externalProvider: user.externalProvider,
        avatar: user.avatar,
      },
    },
  });
}
