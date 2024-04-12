import { APIVersion } from '../../provider/types/common';
import { Entities } from '../constants';
import { createAccountEntity, getAccountEntityKey } from './converter';
import { createMockStepExecutionContext } from '@jupiterone/integration-sdk-testing';

describe('#createAccountEntity', () => {
  test('should convert to entity', () => {
    const context = createMockStepExecutionContext({
      instanceConfig: {
        baseUrl: process.env.BASE_URL || 'http://localhost:9000',
        apiToken: process.env.API_TOKEN || 'string-value',
        apiVersion: APIVersion.V1,
      },
    });

    const entity = createAccountEntity(context.instance);

    expect(entity).toEqual(
      expect.objectContaining({
        _key: getAccountEntityKey(context.instance.id),
        _type: Entities.ACCOUNT._type,
        _class: Entities.ACCOUNT._class,
      }),
    );
  });
});
