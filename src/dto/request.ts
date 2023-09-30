export interface SearchDocsRequestDto {
  files: string[];
  url: string;
  query: string;
  previewLength: number;
  ignoreCase: boolean;
  trimContent: boolean;
  regex: boolean;
  skipCache: boolean;
}

export const SearchDocsQueryParams = {
  files: 'files',
  url: 'url',
  query: 'query',
  previewLength: 'previewLength',
  ignoreCase: 'ignoreCase',
  trimContent: 'trimContent',
  regex: 'regex',
  skipCache: 'skipCache',
} as const;
