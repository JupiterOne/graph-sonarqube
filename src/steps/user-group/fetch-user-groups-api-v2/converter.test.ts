import { SonarqubeUserGroupV2 } from '../../../provider/types/v2';
import { createUserGroupV2Entity } from './converter';

describe('#createUserGroupEntity', () => {
  test('should convert to entity', () => {
    const userGroup = {
      id: 'user-group-id-1',
      name: 'user-group-name-1',
      description: 'User Group Description 1',
      default: true,
      managed: true,
    } as SonarqubeUserGroupV2;

    const entity = createUserGroupV2Entity(userGroup);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'sonarqube-user-group:user-group-id-1',
        _type: 'sonarqube_user_group',
        _class: ['UserGroup'],
        id: 'user-group-id-1',
        name: 'user-group-name-1',
        description: 'User Group Description 1',
        default: true,
        managed: true,
        _rawData: [
          {
            name: 'default',
            rawData: userGroup,
          },
        ],
      }),
    );
  });
});
