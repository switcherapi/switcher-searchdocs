import { Context, Router } from '../deps.ts';

const router = new Router();

router.get('/api/check', ({ response }: Context) => {
  response.status = 200;
  response.body = {
    status: 'ok',
    releaseTime: Deno.env.get('RELEASE_TIME') || 'today',
    sslEnabled: Deno.env.has('SSL_CERT') && Deno.env.has('SSL_KEY'),
  };
});

export default router;
