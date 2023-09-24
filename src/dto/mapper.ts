import { Output } from '../deps.ts';
import { SearchDocsResponseDto } from './response.ts';

export function toSearchDocsDto(output: Output[]): SearchDocsResponseDto {
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
