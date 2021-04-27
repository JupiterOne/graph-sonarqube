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

  async fetchAuthenticationValidate(): Promise<ValidationResponse> {
    return this.makeSingularRequest(
      HttpMethod.GET,
      '/authentication/validate',
    ) as Promise<ValidationResponse>;
  }

  private async makeRequest(
    method: HttpMethod,
    endpoint: string,
  ): Promise<Response> {
    const resourceUrl = `${this.baseUrl}/api${endpoint}`;

    const response: Response = await fetch(resourceUrl, {
      method,
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

  private async makeSingularRequest<T>(
    method: HttpMethod,
    url: string,
  ): Promise<T | null> {
    const response = await this.makeRequest(method, `${url}`);

    return response.json();
  }

  private async iterateResources<T extends string, U>(
    endpoint: string,
    iterableObjectKey: T,
    iteratee: ResourceIteratee<U>,
    options?: {
      onPageError?: PageErrorHandler;
      params?: NodeJS.Dict<string | string[]>;
    },
  ): Promise<void> {
    let page = 1;

    do {
      const searchParams = new URLSearchParams({
        ...options?.params,
        page: String(page),
        per_page: String(ITEMS_PER_PAGE),
      });

      const parametizedEndpoint = `${endpoint}?${searchParams.toString()}`;

      let response: Response | undefined;
      try {
        response = await this.makeRequest(HttpMethod.GET, parametizedEndpoint);
      } catch (err) {
        if (options?.onPageError) {
          await options.onPageError({ err, endpoint });
        } else {
          throw err;
        }
      }

      if (response) {
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

        if (page != result.paging.total) {
          page += 1;
        } else {
          page = 0; // stop pagination, we've reached the end of the line
        }
      } else {
        page = 0; // stop pagination, no page info without response
      }
    } while (page);
  }
}
