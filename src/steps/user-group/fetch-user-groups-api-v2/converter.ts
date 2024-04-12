import { createIntegrationEntity } from '@jupiterone/integration-sdk-core';

import { Entities } from '../../constants';
import { SonarqubeUserGroupV2 } from '../../../provider/types/v2';

export function getUserGroupV2Key(userGroupId: string): string {
  return `sonarqube-user-group:${userGroupId}`;
}

export function createUserGroupV2Entity(userGroup: SonarqubeUserGroupV2) {
  if (!userGroup.id) {
    return;
  }
  return createIntegrationEntity({
    entityData: {
      source: userGroup,
      assign: {
        _key: getUserGroupV2Key(userGroup.id),
        _type: Entities.USER_GROUP._type,
        _class: Entities.USER_GROUP._class,
        id: userGroup.id,
        name: userGroup.name,
        description: userGroup.description,
        default: userGroup.default,
        managed: userGroup.managed,
      },
    },
  });
}
