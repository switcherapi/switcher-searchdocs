import { bold, Context, cyan, green, Next } from '../deps.ts';
import { SearchDocsQueryParams, SearchDocsRequestDto } from '../dto/request.ts';
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
  const APP_FILES = Deno.env.get('APP_FILES') || '';
  const APP_CONTEXT_ENDPOINT = Deno.env.get('APP_CONTEXT_ENDPOINT') || '';

  const searchParams = context.request.url.searchParams;
  const request = {
    query: getParam(searchParams, SearchDocsQueryParams.query, ''),
    url: getParam(searchParams, SearchDocsQueryParams.url, APP_CONTEXT_ENDPOINT),
    files: String(getParam(searchParams, SearchDocsQueryParams.files, APP_FILES)).split(','),
    previewLength: getParam(searchParams, SearchDocsQueryParams.previewLength, 0),
    ignoreCase: getBooleanParam(searchParams, SearchDocsQueryParams.ignoreCase, false),
    trimContent: getBooleanParam(searchParams, SearchDocsQueryParams.trimContent, false),
    regex: getBooleanParam(searchParams, SearchDocsQueryParams.regex, false),
    skipCache: getBooleanParam(searchParams, SearchDocsQueryParams.skipCache, false),
  } as SearchDocsRequestDto;

  context.state.request = request;
  await next();
};
