import { Context, Router } from '../deps.ts';
import { getEnv } from '../utils.ts';

const router = new Router();

router.get('/api/check', ({ response }: Context) => {
  response.status = 200;
  response.body = {
    status: 'ok',
    releaseTime: getEnv('RELEASE_TIME', 'today'),
    sslEnabled: Deno.env.has('SSL_CERT') && Deno.env.has('SSL_KEY'),
    rateLimit: {
      window: getEnv('APP_RATE_LIMIT_WINDOW', 'not set'),
      max: getEnv('APP_RATE_LIMIT', 'not set'),
    },
    appSettings: {
      url: getEnv('APP_URL', 'not set'),
      files: getEnv('APP_FILES', 'not set'),
      cacheExpDuration: getEnv('APP_CACHE_EXP_DURATION', 'not set'),
      cacheSize: getEnv('APP_CACHE_SIZE', 'not set'),
      allowUrl: getEnv('APP_ALLOW_URL', 'not set'),
      allowFiles: getEnv('APP_ALLOW_FILES', 'not set'),
    },
  };
});

export default router;
