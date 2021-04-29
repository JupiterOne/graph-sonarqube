import { createUserGroupEntity } from './converter';
import { SonarqubeUserGroup } from '../../provider/types';

describe('#createUserGroupEntity', () => {
  test('should convert to entity', () => {
    const userGroup = {
      id: 'user-group-id-1',
      name: 'user-group-name-1',
      description: 'User Group Description 1',
      membersCount: 5,
      default: true,
    } as SonarqubeUserGroup;

    const entity = createUserGroupEntity(userGroup);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'sonarqube-user-group:user-group-id-1',
        _type: 'sonarqube_user_group',
        _class: ['UserGroup'],
        id: 'user-group-id-1',
        name: 'user-group-name-1',
        description: 'User Group Description 1',
        membersCount: 5,
        default: true,
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
