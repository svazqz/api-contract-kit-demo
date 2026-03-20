'use client';

import { useState } from 'react';
import { createClient } from '@svazqz/api-contract-kit/dist/client';
import { getGeoData, getServiceStatus } from '@/src/lib/api/definitions';

export function DemoClient() {
  const [geoResponse, setGeoResponse] = useState<unknown>(null);
  const [statusResponse, setStatusResponse] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const runDemo = async () => {
    try {
      setLoading(true);
      setError(null);
      const client = createClient({
        baseUrl: window.location.origin,
      });

      const geo = await client.call(getGeoData, {
        query: { latitude: 19.4326, longitude: -99.1332 },
      });
      const status = await client.call(getServiceStatus, {
        urlParams: { service: 'database' },
        query: { region: 'latam' },
      });

      setGeoResponse(geo);
      setStatusResponse(status);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section>
      <h2>Client call demo</h2>
      <div className="row">
        <button type="button" onClick={runDemo} disabled={loading}>
          {loading ? 'Running…' : 'Run typed client calls'}
        </button>
      </div>
      {error ? <p>{error}</p> : null}
      <pre>{JSON.stringify({ geoResponse, statusResponse }, null, 2)}</pre>
    </section>
  );
}
