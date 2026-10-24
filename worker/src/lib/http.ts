import type { Context } from 'hono';

/** Thrown anywhere; turned into { success:false, error:{...} } by app.onError. */
export class HttpError extends Error {
  constructor(public status: number, message: string, public code?: string) {
    super(message);
  }
}

const CODES: Record<number, string> = {
  400: 'Bad Request',
  401: 'Unauthorized',
  403: 'Forbidden',
  404: 'Not Found',
  409: 'Conflict',
  429: 'Too Many Requests',
  500: 'INTERNAL_ERROR',
  502: 'Bad Gateway',
};

export const badRequest = (m: string) => new HttpError(400, m);
export const unauthorized = (m: string) => new HttpError(401, m);
export const forbidden = (m: string) => new HttpError(403, m);
export const notFound = (m: string) => new HttpError(404, m);
export const conflict = (m: string) => new HttpError(409, m);
export const tooMany = (m: string) => new HttpError(429, m);

/** Same success shape as the old NestJS TransformInterceptor. */
export const ok = (c: Context, data: unknown, status: 200 | 201 = 200) =>
  c.json({ success: true, data: data ?? null, message: 'Operation completed successfully' }, status);

export function errorBody(status: number, message: string, path: string, code?: string) {
  return {
    success: false,
    error: { code: code || CODES[status] || 'Error', message, path, timestamp: new Date().toISOString() },
  };
}

/** Parse a JSON body; {} when empty or not JSON. */
export async function body<T = any>(c: Context): Promise<T> {
  try {
    return (await c.req.json()) as T;
  } catch {
    return {} as T;
  }
}

/** Visitor IP (Cloudflare sets this header). */
export const clientIp = (c: Context) => c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
