import { ZodError } from 'zod';

export function mapRouteError({ stage, error }: { stage: string; error: unknown }) {
  if (error instanceof ZodError) {
    return {
      status: stage === 'payload_validation' ? 422 : 400,
      body: { error: 'Invalid request', issues: error.issues, at: stage },
    };
  }

  return {
    status: 500,
    body: { error: 'Internal error', at: stage },
  };
}
