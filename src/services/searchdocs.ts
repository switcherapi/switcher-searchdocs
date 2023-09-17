import { Output, Skimming } from '../deps.ts';

class SearchDocsService {
  skimmer: Skimming;

  constructor(serviceParams: ServiceParams) {
    this.skimmer = new Skimming({
      expireDuration: serviceParams.expireDuration,
      size: serviceParams.size,
    });
  }

  async skim(params: SkimParams): Promise<Output[]> {
    const { files, url, query, previewLength, ignoreCase, trimContent, regex, skipCache } = params;
    const skimContext = {
      url,
      files,
    };

    this.skimmer.useCache = !skipCache;
    this.skimmer.setContext(skimContext);
    const results = await this.skimmer.skim(query, {
      previewLength,
      ignoreCase,
      trimContent,
      regex,
    });

    return results;
  }
}

interface ServiceParams {
  expireDuration: number;
  size: number;
}

interface SkimParams {
  files: string[];
  url: string;
  query: string;
  previewLength: number;
  ignoreCase: boolean;
  trimContent: boolean;
  regex: boolean;
  skipCache?: boolean;
}

export default SearchDocsService;
