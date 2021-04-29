import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SonarqubeUserGroup } from '../../provider/types';

const USER_GROUP_ID_PREFIX = 'sonarqube-user-group';
export function createUserGroupEntityIdentifier(id: string): string {
  return `${USER_GROUP_ID_PREFIX}:${id}`;
}

export function createUserGroupEntity(userGroup: SonarqubeUserGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: userGroup,
      assign: {
        _key: createUserGroupEntityIdentifier(userGroup.id),
        _type: Entities.USER_GROUP._type,
        _class: Entities.USER_GROUP._class,
        id: userGroup.id,
        name: userGroup.name,
        description: userGroup.description,
        membersCount: userGroup.membersCount,
        default: userGroup.default,
      },
    },
  });
}
