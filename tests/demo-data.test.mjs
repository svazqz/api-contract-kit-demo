import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveGeo, resolveStatus } from '../src/lib/api/demo-data.ts';

const geography = [
  { longitude: -30.01, latitude: 0, city: 'Mexico City', state: 'CDMX', country: 'Mexico', hemisphere: 'north' },
  { longitude: -30, latitude: -1, city: 'Madrid', state: 'Community of Madrid', country: 'Spain', hemisphere: 'south' },
  { longitude: 40, latitude: 1, city: 'Tokyo', state: 'Tokyo', country: 'Japan', hemisphere: 'north' },
];

for (const { latitude, longitude, ...expected } of geography) {
  test(`maps latitude ${latitude} and longitude ${longitude} to ${expected.city}`, () => {
    assert.deepEqual(resolveGeo(latitude, longitude), { ...expected, source: 'demo-dataset' });
  });
}

test('keeps the service and region and derives status from uptime', () => {
  assert.deepEqual(resolveStatus('database', 'latam'), {
    service: 'database', region: 'latam', status: 'healthy', uptimeMinutes: 12840,
  });
  assert.deepEqual(resolveStatus('cache', 'us'), {
    service: 'cache', region: 'us', status: 'healthy', uptimeMinutes: 9821,
  });
  assert.deepEqual(resolveStatus('queue', 'eu'), {
    service: 'queue', region: 'eu', status: 'degraded', uptimeMinutes: 7760,
  });
});

test('maps query, body, and unexpected failures to the appropriate HTTP status', async () => {
  const { z } = await import('zod');
  const { mapRouteError } = await import('../src/lib/api/demo-errors.ts');
  const result = z.number().safeParse('not a number');
  assert.equal(mapRouteError({ stage: 'query_validation', error: result.error }).status, 400);
  assert.equal(mapRouteError({ stage: 'payload_validation', error: result.error }).status, 422);
  assert.deepEqual(mapRouteError({ stage: 'response_handler', error: new Error('private detail') }), {
    status: 500,
    body: { error: 'Internal error', at: 'response_handler' },
  });
});
