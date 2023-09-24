import { bold, Context, cyan, green, Next } from '../deps.ts';
import { SearchDocsRequestDto } from '../dto/request.ts';
import { logger, responseError } from '../utils.ts';

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

export const requestSanitizer = async (context: Context, next: Next) => {
  const searchParams = context.request.url.searchParams;
  const request = {
    files: searchParams.has('files') ? searchParams.get('files')?.split(',') : ['README.md'],
    query: searchParams.get('query') || '',
    url: searchParams.get('url') || 'https://raw.githubusercontent.com/petruki/skimming/master/test/fixtures/',
    previewLength: Number(searchParams.get('previewLength')),
    ignoreCase: searchParams.get('ignoreCase') === 'true',
    trimContent: searchParams.get('trimContent') === 'true',
    regex: searchParams.get('regex') === 'true',
    skipCache: searchParams.get('skipCache') === 'true',
  } as SearchDocsRequestDto;

  if (!request.query.length) {
    return responseError(context, new Error('Invalid query input. Cause: it is empty.'), 400);
  }

  context.state.request = request;
  await next();
};
