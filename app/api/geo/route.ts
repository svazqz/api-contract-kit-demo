import { nextAdapter } from '@svazqz/api-contract-kit/dist/server';
import { getGeoData, postGeoData } from '@/src/lib/api/definitions';

const resolveGeo = (latitude: number, longitude: number) => {
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

const getHandler = nextAdapter(getGeoData, async (_request, query) => {
  const latitude = query?.latitude ?? 0;
  const longitude = query?.longitude ?? 0;
  return resolveGeo(latitude, longitude);
});

const postHandler = nextAdapter(postGeoData, async (_request, _query, _params, payload) => {
  const latitude = payload?.latitude ?? 0;
  const longitude = payload?.longitude ?? 0;
  return resolveGeo(latitude, longitude);
});

export async function GET(request: Request) {
  return getHandler(request);
}

export async function POST(request: Request) {
  return postHandler(request);
}
