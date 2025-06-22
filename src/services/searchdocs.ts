import { type Output, Skimming } from '../deps.ts';
import type { SearchDocsRequestDto } from '../dto/request.ts';

class SearchDocsService {
  private readonly skimmer: Skimming;

  constructor(serviceParams: ServiceParams) {
    this.skimmer = Skimming.create({
      url: serviceParams.url,
      files: serviceParams.files,
      cacheOptions: {
        expireDuration: serviceParams.expireDuration,
        size: serviceParams.size,
      },
    });
  }

  async skim(request: SearchDocsRequestDto): Promise<Output[]> {
    const { query, previewLength, ignoreCase, trimContent, regex, skipCache } = request;
    const results = await this.skimmer.skim(query, {
      skipCache,
      previewLength,
      ignoreCase,
      trimContent,
      regex,
    });

    return results;
  }
}

type ServiceParams = {
  files: string[];
  url: string;
  expireDuration: number;
  size: number;
};

export default SearchDocsService;
