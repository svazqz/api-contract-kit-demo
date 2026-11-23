import { extendZodWithOpenApi } from '@asteasolutions/zod-to-openapi';
import { z } from 'zod';

extendZodWithOpenApi(z);

export const CoordinatesSchema = z
  .object({
    latitude: z.number().min(-90).max(90),
    longitude: z.number().min(-180).max(180),
  })
  .openapi('CoordinatesSchema');

export const CoordinatesQuerySchema = z
  .object({
    latitude: z.coerce.number().min(-90).max(90),
    longitude: z.coerce.number().min(-180).max(180),
  })
  .openapi('CoordinatesQuerySchema');

export const GeoResponseSchema = z
  .object({
    city: z.string(),
    state: z.string(),
    country: z.string(),
    hemisphere: z.enum(['north', 'south']),
    source: z.literal('demo-dataset'),
  })
  .openapi('GeoResponseSchema');

export const ServiceParamsSchema = z
  .object({
    service: z.enum(['database', 'cache', 'queue']),
  })
  .openapi('ServiceParamsSchema');

export const ServiceRegionSchema = z
  .object({
    region: z.enum(['us', 'eu', 'latam']),
  })
  .openapi('ServiceRegionSchema');

export const ServiceStatusResponseSchema = z
  .object({
    service: z.string(),
    region: z.string(),
    status: z.enum(['healthy', 'degraded']),
    uptimeMinutes: z.number(),
  })
  .openapi('ServiceStatusResponseSchema');
