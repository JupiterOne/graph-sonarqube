import { createUserEntity } from './converter';
import { SonarqubeUser } from '../../provider/types';

describe('#createUserEntity', () => {
  test('should convert to entity', () => {
    const user = {
      login: 'userlogin1',
      name: 'User Name 1',
      active: true,
      email: 'user1@email.org',
      groups: ['user-group-1'],
      tokensCount: 0,
      local: true,
      externalIdentity: 'userlogin1',
      externalProvider: 'sonarqube',
    } as SonarqubeUser;

    const entity = createUserEntity(user);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'userlogin1',
        _type: 'sonarqube_user',
        _class: ['User'],
        username: 'userlogin1',
        email: 'user1@email.org',
        shortLoginId: 'userlogin1',
        name: 'User Name 1',
        login: 'userlogin1',
        active: true,
        tokensCount: 0,
        local: true,
        externalIdentity: 'userlogin1',
        externalProvider: 'sonarqube',
        _rawData: [
          {
            name: 'default',
            rawData: user,
          },
        ],
      }),
    );
  });
});
