import SearchDocsService from '../src/services/searchdocs.ts';
import { assert } from './deps.ts';

const testTitle = (description: string) => `SearchDocs service - ${description}`;

Deno.test({
  name: testTitle('it should return feature disabled'),
  async fn() {
    //given
    const service = new SearchDocsService({ expireDuration: 5, size: 100 });

    //test
    const response = await service.skim({
      files: ['README.md'],
      url: 'https://raw.githubusercontent.com/petruki/skimming/master/test/fixtures/',
      query: 'Skimming',
      previewLength: 0,
      ignoreCase: false,
      trimContent: false,
      regex: false,
      skipCache: false,
    });

    //assert
    assert(response);
  },
});
