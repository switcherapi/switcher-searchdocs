import SearchDocsService from '../../src/services/searchdocs.ts';
import { assert, assertEquals } from '../deps.ts';

Deno.test({
  name: 'SearchDocs service - it should return a response with the search results - Remote',
  async fn() {
    //given
    const service = new SearchDocsService({
      url: 'https://raw.githubusercontent.com/petruki/skimming/master/test/fixtures/',
      files: ['README.md'],
      expireDuration: 5,
      size: 100,
    });

    //test
    const response = await service.skim({
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

Deno.test({
  name: 'SearchDocs service - it should return a response with the search results - Local',
  async fn() {
    //given
    const service = new SearchDocsService({
      url: `file:///${Deno.cwd()}/test/fixtures/`,
      files: ['README.md'],
      expireDuration: 5,
      size: 100,
    });

    const response = await service.skim({
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

Deno.test({
  name: 'SearchDocs service - it should return a response segment with the search results - Local',
  async fn() {
    //given
    const service = new SearchDocsService({
      url: `file:///${Deno.cwd()}/test/fixtures/`,
      files: ['README.md'],
      expireDuration: 5,
      size: 100,
    });

    const response = await service.skim({
      query: 'deno test',
      previewLength: -1,
      ignoreCase: false,
      trimContent: true,
      regex: false,
      skipCache: false,
    });

    //assert
    assert(response);
    assertEquals(response[0].segment[0], 'Use `deno test --allow-net` to test mod_test.ts');
  },
});
