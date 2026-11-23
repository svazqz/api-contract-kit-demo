export const resolveGeo = (latitude: number, longitude: number) => {
  const hemisphere = latitude >= 0 ? ('north' as const) : ('south' as const);
  const city = longitude < -30 ? 'Mexico City' : longitude < 40 ? 'Madrid' : 'Tokyo';
  const state = longitude < -30 ? 'CDMX' : longitude < 40 ? 'Community of Madrid' : 'Tokyo';
  const country = longitude < -30 ? 'Mexico' : longitude < 40 ? 'Spain' : 'Japan';

  return {
    city,
    state,
    country,
    hemisphere,
    source: 'demo-dataset' as const,
  };
};

const uptimeByService = {
  database: 12840,
  cache: 9821,
  queue: 7760,
} as const;

export function resolveStatus(service: keyof typeof uptimeByService, region: string) {
  const uptimeMinutes = uptimeByService[service];
  const status = uptimeMinutes > 9000 ? ('healthy' as const) : ('degraded' as const);

  return { service, region, status, uptimeMinutes };
}
