export interface ResponseDto {
  code: number;
  message: string;
}

export interface SearchDocsResponseDto extends ResponseDto {
  results: Result[];
}

export interface Result {
  file: string;
  segment: string[];
  found: number;
  cache: boolean;
}
