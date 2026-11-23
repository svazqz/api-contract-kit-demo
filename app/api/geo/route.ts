import { nextAdapter } from '@svazqz/api-contract-kit/dist/server';
import { mapRouteError } from '@/src/lib/api/demo-errors';
import { getGeoData, postGeoData } from '@/src/lib/api/definitions';

import { resolveGeo } from '@/src/lib/api/demo-data';

const getHandler = nextAdapter({ ...getGeoData, errorMapper: mapRouteError }, async (_request, query) => {
  const latitude = Number(query?.latitude ?? 0);
  const longitude = Number(query?.longitude ?? 0);
  return resolveGeo(latitude, longitude);
});

const postHandler = nextAdapter({ ...postGeoData, errorMapper: mapRouteError }, async (_request, _query, _params, payload) => {
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
