import { Context, Output } from '../deps.ts';
import { getBooleanParam, getEnv, getParam } from '../utils.ts';
import { SearchDocsQueryParams, SearchDocsRequestDto } from './request.ts';
import { SearchDocsResponseDto } from './response.ts';

export function toSearchDocsResponseDto(output: Output[]): SearchDocsResponseDto {
  return {
    code: 200,
    message: 'success',
    results: output.map((item) => ({
      file: item.file,
      segment: item.segment,
      found: item.found,
      cache: item.cache,
    })),
  };
}

export function toSearchDocsRequestDto(context: Context): SearchDocsRequestDto {
  const APP_FILES = getEnv('APP_FILES', '');
  const APP_URL = getEnv('APP_URL', '');
  const APP_ALLOW_URL = getEnv('APP_ALLOW_URL', 'true') === 'true';
  const APP_ALLOW_FILES = getEnv('APP_ALLOW_FILES', 'true') === 'true';

  const searchParams = context.request.url.searchParams;
  return {
    query: String(getParam(searchParams, SearchDocsQueryParams.query, '')),
    url: APP_ALLOW_URL ? String(getParam(searchParams, SearchDocsQueryParams.url, APP_URL)) : APP_URL,
    files: String(APP_ALLOW_FILES ? getParam(searchParams, SearchDocsQueryParams.files, APP_FILES) : APP_FILES).split(
      ',',
    ),
    previewLength: parseInt(String(getParam(searchParams, SearchDocsQueryParams.previewLength, '0'))),
    ignoreCase: getBooleanParam(searchParams, SearchDocsQueryParams.ignoreCase, false),
    trimContent: getBooleanParam(searchParams, SearchDocsQueryParams.trimContent, false),
    regex: getBooleanParam(searchParams, SearchDocsQueryParams.regex, false),
    skipCache: getBooleanParam(searchParams, SearchDocsQueryParams.skipCache, false),
  };
}
