import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../../constants';
import { SonarqubeUserGroup } from '../../../provider/types/v1';

const USER_GROUP_ID_PREFIX = 'sonarqube-user-group';
export function getUserGroupKey(name: string): string {
  return `${USER_GROUP_ID_PREFIX}:${name}`;
}

export function createUserGroupEntity(userGroup: SonarqubeUserGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: userGroup,
      assign: {
        _key: getUserGroupKey(userGroup.name),
        _type: Entities.USER_GROUP._type,
        _class: Entities.USER_GROUP._class,
        id: userGroup.name,
        name: userGroup.name,
        description: userGroup.description,
        membersCount: userGroup.membersCount,
        default: userGroup.default,
      },
    },
  });
}
