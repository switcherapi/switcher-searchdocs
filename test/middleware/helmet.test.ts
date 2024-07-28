import Helmet from '../../src/middleware/helmet.ts';
import type { Context, Next } from '../../src/deps.ts';
import { assertEquals } from '../deps.ts';

const newRequest = () => {
  return {
    request: {
      ip: 'localhost',
    },
    response: {
      status: 0,
      body: {},
      headers: new Headers(),
    },
  };
};

Deno.test({
  name: 'Helmet middleware - it should set the headers',
  async fn() {
    const helmet = new Helmet();
    const middleware = helmet.middleware();

    const next = () => {
      return;
    };

    const req = newRequest();
    await middleware(req as Context, next as Next);

    assertEquals(req.response.headers.get('Server'), 'Deno');
    assertEquals(req.response.headers.get('Access-Control-Allow-Origin'), '*');
    assertEquals(
      req.response.headers.get('Content-Security-Policy'),
      "default-src 'self' 'unsafe-inline' 'unsafe-eval' data: https: http:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';",
    );
    assertEquals(req.response.headers.get('X-Content-Type-Options'), 'nosniff');
    assertEquals(req.response.headers.get('X-Frame-Options'), 'DENY');
    assertEquals(req.response.headers.get('X-XSS-Protection'), '1; mode=block');
    assertEquals(req.response.headers.get('Strict-Transport-Security'), 'max-age=31536000; includeSubDomains; preload');
    assertEquals(req.response.headers.get('Referrer-Policy'), 'no-referrer');
    assertEquals(
      req.response.headers.get('Permissions-Policy'),
      'geolocation=(), microphone=(), camera=(), payment=()',
    );
  },
});
