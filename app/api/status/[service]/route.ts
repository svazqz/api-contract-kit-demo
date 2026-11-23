import { nextAdapter } from '@svazqz/api-contract-kit/dist/server';
import { mapRouteError } from '@/src/lib/api/demo-errors';
import { getServiceStatus } from '@/src/lib/api/definitions';

import { resolveStatus } from '@/src/lib/api/demo-data';

const getHandler = nextAdapter({ ...getServiceStatus, errorMapper: mapRouteError }, async (_request, query, urlParams) => {
  return resolveStatus(urlParams?.service ?? 'database', query?.region ?? 'us');
});

export async function GET(
  request: Request,
  context: { params: Promise<{ service: string }> },
) {
  const params = await context.params;
  return getHandler(request, { params });
}
