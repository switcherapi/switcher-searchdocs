import { bold, Context, cyan, green, Next } from '../deps.ts';
import { logger } from '../utils.ts';

export const responseTime = async (context: Context, next: Next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  context.response.headers.set('X-Response-Time', `${ms}ms`);
};

export const responseTimeLog = async (context: Context, next: Next) => {
  await next();
  const rt = context.response.headers.get('X-Response-Time');

  logger(
    'DEBUG',
    'Route',
    `${green(context.request.method)} ${cyan(decodeURIComponent(context.request.url.pathname))} - ${bold(String(rt))}`,
  );
};
