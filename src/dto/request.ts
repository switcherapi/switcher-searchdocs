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
