import { IntegrationInstanceConfig } from '@jupiterone/integration-sdk-core';
import { APIVersion } from './provider/types/common';
import { SonarqubeClient } from './provider/SonarqubeClient';

export interface SonarqubeIntegrationConfig extends IntegrationInstanceConfig {
  baseUrl: string;
  apiToken: string;
  /**
   * This field is used to indicate if Sonarqube system version is under 10.4
   * if under 10.4 -> {@link APIVersion.V1}
   * else if under 10.4 -> {@link APIVersion.V2}
   * This is going to help determining how pagination query params must look like
   * Keep in mind that this doesn't automatically change the URL for endpoints that
   * need to hit V2. See {@link SonarqubeClient.makeRequest}
   * where the parameter {@param endpointVersion} determines the url to query
   */
  apiVersion: APIVersion;
}
