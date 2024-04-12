import { createUserGroupEntity } from './converter';
import { SonarqubeUserGroup } from '../../../provider/types/v1';

describe('#createUserGroupEntity', () => {
  test('should convert to entity', () => {
    const userGroup = {
      name: 'user-group-name-1',
      description: 'User Group Description 1',
      membersCount: 5,
      default: true,
    } as SonarqubeUserGroup;

    const entity = createUserGroupEntity(userGroup);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'sonarqube-user-group:user-group-name-1',
        _type: 'sonarqube_user_group',
        _class: ['UserGroup'],
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
