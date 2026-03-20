import { nextAdapter } from '@svazqz/api-contract-kit/dist/server';
import { getServiceStatus } from '@/src/lib/api/definitions';

const uptimeByService = {
  database: 12840,
  cache: 9821,
  queue: 7760,
} as const;

const getHandler = nextAdapter(getServiceStatus, async (_request, query, urlParams) => {
  const service = urlParams?.service ?? 'database';
  const region = query?.region ?? 'us';
  const uptimeMinutes = uptimeByService[service];
  const status = uptimeMinutes > 9000 ? ('healthy' as const) : ('degraded' as const);

  return {
    service,
    region,
    status,
    uptimeMinutes,
  };
});

export async function GET(
  request: Request,
  context: { params: Promise<{ service: string }> },
) {
  const params = await context.params;
  return getHandler(request, { params });
}
