import app from './app.ts';
import { logger } from './utils.ts';

const APP_PORT = Deno.env.get('APP_PORT') || 4000;
const SSL_CERT = Deno.env.get('SSL_CERT');
const SSL_KEY = Deno.env.get('SSL_KEY');

const createServer = () => {
  if (SSL_CERT && SSL_KEY) {
    logger('INFO', 'createServer', `SSL enabled - Listening on: ${APP_PORT}`);
    app.listen({
      port: Number(APP_PORT),
      secure: true,
      key: Deno.readTextFileSync(SSL_KEY),
      cert: Deno.readTextFileSync(SSL_CERT),
    });
  } else {
    logger('INFO', 'createServer', `SSL disabled - Listening on: ${APP_PORT}`);
    app.listen({ port: Number(APP_PORT) });
  }

  logger('INFO', 'createServer', `Context url             ${Deno.env.get('APP_URL')}`);
  logger('INFO', 'createServer', `Context files           ${Deno.env.get('APP_FILES')}`);
  logger('INFO', 'createServer', `Context cache duration  ${Deno.env.get('APP_CACHE_EXP_DURATION')}`);
  logger('INFO', 'createServer', `Context cache size      ${Deno.env.get('APP_CACHE_SIZE')}`);
};

createServer();
