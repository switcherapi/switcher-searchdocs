export type SearchDocsRequestDto = {
  query: string;
  previewLength: number;
  ignoreCase: boolean;
  trimContent: boolean;
  regex: boolean;
  skipCache: boolean;
};

export const SearchDocsQueryParams = {
  query: 'query',
  previewLength: 'previewLength',
  ignoreCase: 'ignoreCase',
  trimContent: 'trimContent',
  regex: 'regex',
  skipCache: 'skipCache',
} as const;
