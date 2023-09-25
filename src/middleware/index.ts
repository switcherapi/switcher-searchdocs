import { bold, Context, cyan, green, Next } from '../deps.ts';
import { SearchDocsRequestDto } from '../dto/request.ts';
import { getBooleanParam, getParam, logger } from '../utils.ts';

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

export const mapToSearchDocsRequestDto = async (context: Context, next: Next) => {
  const searchParams = context.request.url.searchParams;
  const request = {
    files: String(getParam(searchParams, 'files', 'README.md')).split(','),
    query: getParam(searchParams, 'query', ''),
    url: getParam(searchParams, 'url', 'https://raw.githubusercontent.com/petruki/skimming/master/test/fixtures/'),
    previewLength: getParam(searchParams, 'previewLength', 0),
    ignoreCase: getBooleanParam(searchParams, 'ignoreCase', false),
    trimContent: getBooleanParam(searchParams, 'trimContent', false),
    regex: getBooleanParam(searchParams, 'regex', false),
    skipCache: getBooleanParam(searchParams, 'skipCache', false),
  } as SearchDocsRequestDto;

  context.state.request = request;
  await next();
};
