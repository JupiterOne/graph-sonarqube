import fetch, { Response } from 'node-fetch';
import { URLSearchParams } from 'url';

import {
  IntegrationError,
  IntegrationProviderAPIError,
  IntegrationProviderAuthenticationError,
  IntegrationProviderAuthorizationError,
} from '@jupiterone/integration-sdk-core';

import {
  SonarqubeProject,
  PaginatedResponse,
  ValidationResponse,
  SonarqubeUserGroup,
  SonarqubeUser,
} from './types';

/**
 * default: 100, max: ?
 */
const ITEMS_PER_PAGE = 100;

export type ResourceIteratee<T> = (each: T) => Promise<void> | void;
export type PageErrorHandler = ({
  err: Error,
  endpoint: string,
}) => Promise<void> | void;

export enum HttpMethod {
  GET = 'get',
  POST = 'post',
}

export class SonarqubeClient {
  private readonly baseUrl: string;
  private readonly authorization: string;

  constructor(baseUrl: string, apiToken: string) {
    this.baseUrl = baseUrl;
    this.authorization = Buffer.from(`${apiToken}:`).toString('base64');
  }

  async iterateProjects(
    iteratee: ResourceIteratee<SonarqubeProject>,
  ): Promise<void> {
    return this.iterateResources<'components', SonarqubeProject>(
      '/projects/search',
      'components',
      iteratee,
    );
  }

  async iterateUserGroups(
    iteratee: ResourceIteratee<SonarqubeUserGroup>,
  ): Promise<void> {
    return this.iterateResources<'groups', SonarqubeUserGroup>(
      '/user_groups/search',
      'groups',
      iteratee,
    );
  }

  async iterateUsers(iteratee: ResourceIteratee<SonarqubeUser>): Promise<void> {
    return this.iterateResources<'users', SonarqubeUser>(
      '/users/search',
      'users',
      iteratee,
    );
  }

  async fetchAuthenticationValidate(): Promise<ValidationResponse> {
    return this.makeSingularRequest('/authentication/validate') as Promise<
      ValidationResponse
    >;
  }

  private async makeRequest(endpoint: string): Promise<Response> {
    const resourceUrl = `${this.baseUrl}/api${endpoint}`;

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

    return response.json();
  }

  private async iterateResources<T extends string, U>(
    endpoint: string,
    iterableObjectKey: T,
    iteratee: ResourceIteratee<U>,
  ): Promise<void> {
    let page = 1;

    do {
      const searchParams = new URLSearchParams({
        page: String(page),
        per_page: String(ITEMS_PER_PAGE),
      });

      const parametizedEndpoint = `${endpoint}?${searchParams.toString()}`;

      const response: Response = await this.makeRequest(parametizedEndpoint);
      const result: PaginatedResponse<T, U> = await response.json();
      if (Array.isArray(result[iterableObjectKey])) {
        for (const resource of result[iterableObjectKey]) {
          await iteratee(resource);
        }
      } else {
        throw new IntegrationError({
          code: 'UNEXPECTED_RESPONSE_DATA',
          message: `Expected a collection of resources but type was ${typeof result}`,
        });
      }

      if (result[iterableObjectKey].length) {
        page = 0; // stop pagination, we've reached the end of the line
      } else {
        page += 1;
      }
    } while (page);
  }
}
