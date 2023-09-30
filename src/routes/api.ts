import { Context, Router } from '../deps.ts';

const router = new Router();

router.get('/api/check', ({ response }: Context) => {
  response.status = 200;
  response.body = {
    status: 'ok',
    releaseTime: Deno.env.get('RELEASE_TIME') || 'today',
    sslEnabled: Deno.env.has('SSL_CERT') && Deno.env.has('SSL_KEY'),
    appSettings: {
      contextEndpoint: Deno.env.get('APP_CONTEXT_ENDPOINT') || 'not set',
      files: Deno.env.get('APP_FILES') || 'not set',
      cacheExpDuration: Deno.env.get('APP_CACHE_EXP_DURATION') || 'not set',
      cacheSize: Deno.env.get('APP_CACHE_SIZE') || 'not set',
    },
  };
});

export default router;
