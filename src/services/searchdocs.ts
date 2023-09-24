import { Output, Skimming } from '../deps.ts';
import { SearchDocsRequestDto } from '../dto/request.ts';

class SearchDocsService {
  private skimmer: Skimming;

  constructor(serviceParams: ServiceParams) {
    this.skimmer = new Skimming({
      expireDuration: serviceParams.expireDuration,
      size: serviceParams.size,
    });
  }

  async skim(request: SearchDocsRequestDto): Promise<Output[]> {
    const { files, url, query, previewLength, ignoreCase, trimContent, regex, skipCache } = request;
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

export default SearchDocsService;
