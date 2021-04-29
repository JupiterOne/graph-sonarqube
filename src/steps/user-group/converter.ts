import {
  createIntegrationEntity,
  Entity,
} from '@jupiterone/integration-sdk-core';

import { Entities } from '../constants';
import { SonarqubeUserGroup } from '../../provider/types';

export function createUserGroupEntity(userGroup: SonarqubeUserGroup): Entity {
  return createIntegrationEntity({
    entityData: {
      source: userGroup,
      assign: {
        _key: userGroup.id,
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
