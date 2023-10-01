import { Context, Output } from '../deps.ts';
import { getBooleanParam, getParam } from '../utils.ts';
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
  const APP_FILES = Deno.env.get('APP_FILES') || '';
  const APP_CONTEXT_ENDPOINT = Deno.env.get('APP_CONTEXT_ENDPOINT') || '';

  const searchParams = context.request.url.searchParams;
  return {
    query: String(getParam(searchParams, SearchDocsQueryParams.query, '')),
    url: String(getParam(searchParams, SearchDocsQueryParams.url, APP_CONTEXT_ENDPOINT)),
    files: String(getParam(searchParams, SearchDocsQueryParams.files, APP_FILES)).split(','),
    previewLength: parseInt(String(getParam(searchParams, SearchDocsQueryParams.previewLength, '0'))),
    ignoreCase: getBooleanParam(searchParams, SearchDocsQueryParams.ignoreCase, false),
    trimContent: getBooleanParam(searchParams, SearchDocsQueryParams.trimContent, false),
    regex: getBooleanParam(searchParams, SearchDocsQueryParams.regex, false),
    skipCache: getBooleanParam(searchParams, SearchDocsQueryParams.skipCache, false),
  };
}
