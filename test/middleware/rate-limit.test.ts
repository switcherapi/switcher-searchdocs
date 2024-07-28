import RateLimit from '../../src/middleware/rate-limit.ts';
import type { Context, Next } from '../../src/deps.ts';
import { assertEquals } from '../deps.ts';

const newRequest = () => {
  return {
    request: {
      ip: 'localhost',
      url: new URL('http://localhost/api/check'),
    },
    response: {
      status: 0,
      body: {},
      headers: new Headers(),
    },
  };
};

Deno.test({
  name: 'RateLimit middleware - it should return 429 error when limit is exceeded',
  async fn() {
    const rateLimit = new RateLimit();
    const middleware = rateLimit.middleware({
      limit: 1,
      windowMs: 1000,
    });

    const next = () => {
      return;
    };

    const req1 = newRequest();
    await middleware(req1 as Context, next as Next);
    assertEquals(req1.response.status, 0);
    assertEquals(req1.response.headers.get('X-RateLimit-Limit'), '1');
    assertEquals(req1.response.headers.get('X-RateLimit-Remaining'), '0');

    const req2 = newRequest();
    await middleware(req2 as Context, next as Next);
    assertEquals(req2.response.status, 429);
    assertEquals(req2.response.body, { error: 'Too many requests' });
  },
});

Deno.test({
  name: 'RateLimit middleware - it should NOT return 429 error when whitelisted path',
  async fn() {
    const rateLimit = new RateLimit();
    const middleware = rateLimit.middleware({
      limit: 1,
      windowMs: 1000,
    }, ['/api/check']);

    const next = () => {
      return;
    };

    const req1 = newRequest();
    await middleware(req1 as Context, next as Next);
    assertEquals(req1.response.status, 0);

    const req2 = newRequest();
    await middleware(req2 as Context, next as Next);
    assertEquals(req2.response.status, 0);
  },
});

Deno.test({
  name: 'RateLimit middleware - it should reset counter after windowMs',
  async fn() {
    const rateLimit = new RateLimit();
    const middleware = rateLimit.middleware({
      limit: 1,
      windowMs: 500,
    });

    const next = () => {
      return;
    };

    const req1 = newRequest();
    await middleware(req1 as Context, next as Next);
    assertEquals(req1.response.status, 0);

    const req2 = newRequest();
    await middleware(req2 as Context, next as Next);
    assertEquals(req2.response.status, 429);
    assertEquals(req2.response.body, { error: 'Too many requests' });

    await new Promise((resolve) => setTimeout(resolve, 1000));
    const req3 = newRequest();
    await middleware(req3 as Context, next as Next);
    assertEquals(req3.response.status, 0);
  },
});
