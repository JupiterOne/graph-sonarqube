import { createAccountEntity } from './converter';
import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

describe('#createAccountEntity', () => {
  test('should convert to entity', () => {
    const context = createMockStepExecutionContext({
      instanceConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:9000',
        apiToken: process.env.API_TOKEN || 'string-value',
      },
    });

    const entity = createAccountEntity(context.instance);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: 'sonarqube_account',
        _type: 'sonarqube_account',
        _class: ['Account'],
      }),
    );
  });
});
