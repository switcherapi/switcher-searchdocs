import app from '../../src/app.ts';
import { SearchDocsQueryParams } from '../../src/dto/request.ts';
import type { SearchDocsResponseDto } from '../../src/dto/response.ts';
import { assert, assertEquals, type IResponse, superoak } from '../deps.ts';

const testBody = (fn: (t: Deno.TestContext) => void | Promise<void>) => {
  return async (t: Deno.TestContext) => {
    Deno.env.set('APP_URL', `file:///${Deno.cwd()}/tests/fixtures/`);
    await fn(t);
  }
};

Deno.test({
  name: 'SearchDocs route - it should return search results from cache on second request',
  fn: testBody(async () => {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');

    // First request
    let request = await superoak(app);
    let response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    assertResponse(response);
    let responseDto = response.body as SearchDocsResponseDto;
    assertEquals(responseDto.results[0].cache, false);

    // Second request
    request = await superoak(app);
    response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    assertResponse(response);
    responseDto = response.body as SearchDocsResponseDto;
    assertEquals(responseDto.results[0].cache, true);
  }),
});

Deno.test({
  name: 'SearchDocs route - it should return search results from remote on second request - skipCache',
  fn: testBody(async () => {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.skipCache, 'true');

    // First request
    let request = await superoak(app);
    let response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    assertResponse(response);
    let responseDto = response.body as SearchDocsResponseDto;
    assertEquals(responseDto.results[0].cache, false);

    // Second request
    request = await superoak(app);
    response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    assertResponse(response);
    responseDto = response.body as SearchDocsResponseDto;
    assertEquals(responseDto.results[0].cache, false);
  }),
});

function assertResponse(response: IResponse) {
  const responseDto = response.body as SearchDocsResponseDto;
  assert(responseDto.code === 200);
  assert(responseDto.results.length > 0);
  assert(responseDto.results[0].file);
  assert(responseDto.results[0].segment);
  assert(responseDto.results[0].found);
}
