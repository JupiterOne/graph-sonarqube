import { SonarqubeUserV2 } from '../../../provider/types/v2';
import { createUserV2Entity } from './converter';

describe('#createUserEntity', () => {
  test('should convert to entity', () => {
    const user = {
      id: 'testId',
      login: 'userlogin1',
      name: 'User Name 1',
      email: 'user1@email.org',
      active: true,
      externalProvider: 'sonarqube',
    } as SonarqubeUserV2;

    const entity = createUserV2Entity(user);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'sonarqube-user:testId',
        _type: 'sonarqube_user',
        _class: ['User'],
        username: 'userlogin1',
        email: 'user1@email.org',
        shortLoginId: 'userlogin1',
        name: 'User Name 1',
        login: 'userlogin1',
        active: true,
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
