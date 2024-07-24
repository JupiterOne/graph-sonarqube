import fetch, { Response } from 'node-fetch';
import { URLSearchParams } from 'url';

import {
  IntegrationError,
  IntegrationLogger,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
  IntegrationWarnEventName,
} from '@jupiterone/integration-sdk-core';

import {
  SonarqubeProject,
  SonarqubeUserGroup,
  SonarqubeUser,
  SonarqubeFinding,
  SonarqubeSystemInfo,
  ValidationResponse,
} from './types/v1';
import {
  SonarqubeGroupMembership,
  SonarqubeUserGroupV2,
  SonarqubeUserV2,
} from './types/v2';
import {
  APIVersion,
  APIVersionBaseUrl,
  PaginatedResponse,
  PaginationQueryParams,
} from './types/common';
import { SonarqubeIntegrationConfig } from '../types';

/**
 * default: 100, max: ?
 */
const ITEMS_PER_PAGE = 100;

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
}

export class SonarqubeClient {
  private readonly authorization: string;

  constructor(
    readonly config: SonarqubeIntegrationConfig,
    readonly logger: IntegrationLogger,
  ) {
    this.authorization = Buffer.from(`${config.apiToken}:`).toString('base64');
    this.logger = logger;
  }

  async fetchSystemInfo() {
    return this.makeSingularRequest(
      '/system/info',
    ) as Promise<SonarqubeSystemInfo>;
  }

  async iterateProjects(
    iteratee: ResourceIteratee<SonarqubeProject>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'components', SonarqubeProject>({
      endpoint: '/projects/search',
      iterableObjectKey: 'components',
      iteratee,
      params,
    });
  }

  async iterateUserGroupsV1(
    iteratee: ResourceIteratee<SonarqubeUserGroup>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'groups', SonarqubeUserGroup>({
      endpoint: '/user_groups/search',
      iterableObjectKey: 'groups',
      iteratee,
      params,
    });
  }

  async iterateUserGroupsV2(
    iteratee: ResourceIteratee<SonarqubeUserGroupV2>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'groups', SonarqubeUserGroupV2>({
      endpoint: '/authorizations/groups',
      iterableObjectKey: 'groups',
      iteratee,
      params,
      endpointVersion: APIVersion.V2,
    });
  }

  async iterateUsersV1(
    iteratee: ResourceIteratee<SonarqubeUser>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'users', SonarqubeUser>({
      endpoint: '/users/search',
      iterableObjectKey: 'users',
      iteratee,
      params,
    });
  }

  async iterateUsersV2(
    iteratee: ResourceIteratee<SonarqubeUserV2>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'users', SonarqubeUserV2>({
      endpoint: '/users-management/users',
      iterableObjectKey: 'users',
      iteratee,
      params,
      endpointVersion: APIVersion.V2,
    });
  }

  async iterateGroupsAssignedToUser(
    login: string,
    iteratee: ResourceIteratee<SonarqubeUserGroup>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'groups', SonarqubeUserGroup>({
      endpoint: '/users/groups',
      iterableObjectKey: 'groups',
      iteratee,
      params: { login, ...params },
    });
  }

  async iterateGroupMemberships(
    iteratee: ResourceIteratee<SonarqubeGroupMembership>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'groupMemberships', SonarqubeGroupMembership>({
      endpoint: '/authorizations/group-memberships',
      iterableObjectKey: 'groupMemberships',
      iteratee,
      params,
      endpointVersion: APIVersion.V2,
    });
  }

  async iterateProjectFindings(
    iteratee: ResourceIteratee<SonarqubeFinding>,
    params?: NodeJS.Dict<string | string[]>,
  ): Promise<void> {
    return this.iterateResources<'issues', SonarqubeFinding>({
      endpoint: '/issues/search',
      iterableObjectKey: 'issues',
      iteratee,
      params,
    });
  }

  async fetchAuthenticationValidate(): Promise<ValidationResponse> {
    return this.makeSingularRequest(
      '/authentication/validate',
    ) as Promise<ValidationResponse>;
  }

  private async makeRequest(
    endpoint: string,
    endpointVersion: APIVersion = APIVersion.V1,
  ): Promise<Response> {
    const apiBaseUrl = APIVersionBaseUrl[endpointVersion];
    const resourceUrl = `${this.config.baseUrl}${apiBaseUrl}${endpoint}`;

    const response: Response = await fetch(resourceUrl, {
      method: 'get',
      headers: {
        Authorization: `Basic ${this.authorization}`,
      },
    });

    if (response.status === 401) {
      throw new IntegrationProviderAuthenticationError({
        endpoint,
        status: response.status,
        statusText: response.statusText,
      });
    } else if (response.status === 403) {
      throw new IntegrationProviderAuthorizationError({
        endpoint,
        status: response.status,
        statusText: response.statusText,
      });
    } else if (!response.ok) {
      throw new IntegrationProviderAPIError({
        endpoint,
        status: response.status,
        statusText: response.statusText,
      });
    }

    return response;
  }

  private async makeSingularRequest<T>(url: string): Promise<T | null> {
    const response = await this.makeRequest(`${url}`);

    return response.json() as T;
  }

  private async iterateResources<T extends string, U>({
    endpoint,
    iterableObjectKey,
    iteratee,
    params,
    endpointVersion = APIVersion.V1,
  }: {
    endpoint: string;
    iterableObjectKey: T;
    iteratee: ResourceIteratee<U>;
    params?: NodeJS.Dict<string | string[]>;
    endpointVersion?: APIVersion;
  }): Promise<void> {
    let page = 1;

    do {
      if (page * ITEMS_PER_PAGE > 10000) {
        // We have a hard limit of 10,000 items imposed by the current API
        this.logger.warn(
          { page, endpoint, params },
          `Unable to paginate through more than 10,000 total entries due to API limitations.  Not all data will be ingested.`,
        );
        this.logger.publishWarnEvent({
          name: IntegrationWarnEventName.IngestionLimitEncountered,
          description: `Unable to paginate through more than 10,000 total entries due to API limitations.  Not all data will be ingested.  Endpoint: [${endpoint}]   Parameters: [${JSON.stringify(
            params,
          )}]`,
        });
        break;
      }

      const paginationQueryParms = PaginationQueryParams[endpointVersion];

      const sanitizedParams: Record<string, string> = {};
      if (params) {
        Object.keys(params).forEach((key) => {
          const value = params[key];
          if (value !== undefined) {
            sanitizedParams[key] = Array.isArray(value)
              ? value.join(',')
              : value;
          }
        });
      }

      const searchParams = new URLSearchParams({
        [paginationQueryParms.pageIndex]: String(page),
        [paginationQueryParms.pageSize]: String(ITEMS_PER_PAGE),
        ...sanitizedParams,
      });

      const parametizedEndpoint = `${endpoint}?${searchParams.toString()}`;

      const response: Response = await this.makeRequest(
        parametizedEndpoint,
        endpointVersion,
      );
      const result: PaginatedResponse<T, U> =
        (await response.json()) as PaginatedResponse<T, U>;
      const items = result[iterableObjectKey];
      if (Array.isArray(items)) {
        for (const resource of items) {
          await iteratee(resource);
        }
      } else {
        throw new IntegrationError({
          code: 'UNEXPECTED_RESPONSE_DATA',
          message: `Expected a collection of resources but type was ${typeof result}`,
        });
      }

      if (items.length) {
        page += 1;
      } else {
        page = 0; // stop pagination, we've reached the end of the line
      }
    } while (page);
  }
}
