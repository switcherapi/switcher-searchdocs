import app from './app.ts';
import { getEnv, logger } from './utils.ts';

const APP_PORT = getEnv('APP_PORT', 4000);
const SSL_CERT = getEnv('SSL_CERT', '');
const SSL_KEY = getEnv('SSL_KEY', '');

const createServer = () => {
  if (SSL_CERT && SSL_KEY) {
    logger('INFO', 'createServer', 'SSL enabled');
    app.listen({
      port: Number(APP_PORT),
      secure: true,
      key: Deno.readTextFileSync(SSL_KEY),
      cert: Deno.readTextFileSync(SSL_CERT),
    });
  } else {
    logger('INFO', 'createServer', 'SSL disabled');
    app.listen({ port: Number(APP_PORT) });
  }

  logger('INFO', 'createServer', {
    port: APP_PORT,
    rateLimit: getEnv('APP_RATE_LIMIT', '--not set--'),
    rateWindow: getEnv('APP_RATE_LIMIT_WINDOW', '--not set--'),
    context: {
      url: getEnv('APP_URL', '--not set--'),
      files: getEnv('APP_FILES', '--not set--'),
      cacheDuration: getEnv('APP_CACHE_EXP_DURATION', '--not set--'),
      cacheSize: getEnv('APP_CACHE_SIZE', '--not set--'),
    },
  });
};

createServer();
