import { Context, Middleware, Next } from '../deps.ts';

export default class Helmet {
  public middleware(): Middleware {
    return async (context: Context, next: Next) => {
      context.response.headers.set('Server', 'Deno');
      context.response.headers.set('Access-Control-Allow-Origin', '*');
      context.response.headers.set(
        'Content-Security-Policy',
        'default-src \'self\' \'unsafe-inline\' \'unsafe-eval\' data: https: http:; object-src \'none\'; base-uri \'none\'; form-action \'self\'; frame-ancestors \'none\';',
      );
      context.response.headers.set('X-Content-Type-Options', 'nosniff');
      context.response.headers.set('X-Frame-Options', 'DENY');
      context.response.headers.set('X-XSS-Protection', '1; mode=block');
      context.response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
      context.response.headers.set('Referrer-Policy', 'no-referrer');
      context.response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()');
      await next();
    };
  }
}
