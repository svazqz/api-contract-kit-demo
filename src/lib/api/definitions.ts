import { createAPIDefinition } from '@svazqz/api-contract-kit/dist/api-contract-kit';
import {
  CoordinatesQuerySchema,
  CoordinatesSchema,
  GeoResponseSchema,
  ServiceParamsSchema,
  ServiceRegionSchema,
  ServiceStatusResponseSchema,
} from './schemas';

export const getGeoData = createAPIDefinition({
  method: 'get',
  path: '/geo',
  schemas: {
    queryParams: CoordinatesQuerySchema,
    response: GeoResponseSchema,
  },
  openapi: {
    summary: 'Get geolocation info by coordinates',
    description: 'Returns demo city/state/country information for the given coordinates',
    tags: ['geo'],
    operationId: 'getGeoData',
  },
});

export const postGeoData = createAPIDefinition({
  method: 'post',
  path: '/geo',
  schemas: {
    payload: CoordinatesSchema,
    response: GeoResponseSchema,
  },
  openapi: {
    summary: 'Create geolocation lookup',
    description: 'Validates payload and returns a mocked location response',
    tags: ['geo'],
    operationId: 'postGeoData',
  },
});

export const getServiceStatus = createAPIDefinition({
  method: 'get',
  path: '/status/{service}',
  schemas: {
    urlArgs: ServiceParamsSchema,
    queryParams: ServiceRegionSchema,
    response: ServiceStatusResponseSchema,
  },
  openapi: {
    summary: 'Get service status by service name',
    description: 'Returns a mocked health status for a selected service and region',
    tags: ['status'],
    operationId: 'getServiceStatus',
  },
});
