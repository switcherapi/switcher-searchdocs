import { Context, Middleware, Next } from '../deps.ts';

const SERVER = 'Deno';
const ACCESS_CONTROL_ALLOW_ORIGIN = '*';
const ACCESS_CONTROL_ALLOW_METHODS = 'GET,POST,OPTIONS';
const ACCESS_CONTROL_ALLOW_HEADERS = 'Content-Type, Accept';
const CONTENT_SECURITY_POLICY =
  "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: http:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';";
const X_CONTENT_TYPE_OPTIONS = 'nosniff';
const X_FRAME_OPTIONS = 'DENY';
const X_XSS_PROTECTION = '1; mode=block';
const STRICT_TRANSPORT_SECURITY = 'max-age=31536000; includeSubDomains; preload';
const REFERRER_POLICY = 'no-referrer';
const PERMISSIONS_POLICY = 'geolocation=(), microphone=(), camera=(), payment=()';

export default class Helmet {
  public middleware(): Middleware {
    return async (context: Context, next: Next) => {
      context.response.headers.set('Server', SERVER);
      context.response.headers.set('Access-Control-Allow-Origin', ACCESS_CONTROL_ALLOW_ORIGIN);
      context.response.headers.set('Access-Control-Allow-Methods', ACCESS_CONTROL_ALLOW_METHODS);
      context.response.headers.set('Access-Control-Allow-Headers', ACCESS_CONTROL_ALLOW_HEADERS);
      context.response.headers.set('Content-Security-Policy', CONTENT_SECURITY_POLICY);
      context.response.headers.set('X-Content-Type-Options', X_CONTENT_TYPE_OPTIONS);
      context.response.headers.set('X-Frame-Options', X_FRAME_OPTIONS);
      context.response.headers.set('X-XSS-Protection', X_XSS_PROTECTION);
      context.response.headers.set('Strict-Transport-Security', STRICT_TRANSPORT_SECURITY);
      context.response.headers.set('Referrer-Policy', REFERRER_POLICY);
      context.response.headers.set('Permissions-Policy', PERMISSIONS_POLICY);

      if (context.request.method === 'OPTIONS') {
        context.response.status = 204;
      }

      await next();
    };
  }
}
