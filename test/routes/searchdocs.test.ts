import app from '../../src/app.ts';
import { SearchDocsQueryParams } from '../../src/dto/request.ts';
import { SearchDocsResponseDto } from '../../src/dto/response.ts';
import { assert, assertEquals, IResponse, superoak } from '../deps.ts';

const testTitle = (description: string) => `SearchDocs route - ${description}`;

Deno.test({
  name: testTitle('it should return search results'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    assertResponse(response);
  },
});

Deno.test({
  name: testTitle('it should return search results - using "previewLength"'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.previewLength, '2');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    const responseDto = response.body as SearchDocsResponseDto;
    assertResponse(response);
    assert(responseDto.results[0].segment[0].length === 2);
  },
});

Deno.test({
  name: testTitle('it should return search results - using "previewLength" with negative value (show line)'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.previewLength, '-1');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    const responseDto = response.body as SearchDocsResponseDto;
    assertResponse(response);
    assert(responseDto.results[0].segment[0].length > 'Skimming'.length);
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - missing Query'),
  async fn() {
    const request = await superoak(app);
    const response = await request.get(`/`)
      .send()
      .expect(400);

    assertEquals(response.body.error, 'Invalid query input. Cause: it is empty.');
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - invalid "query" input'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'A'.repeat(101));

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid query input. Cause: it is greater than 100 characters.');
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - invalid "previewLength" input'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.previewLength, 'invalid');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid previewLength input. Cause: it is not a valid number.');
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - invalid "ignoreCase" input'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.ignoreCase, 'invalid');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid ignoreCase input. Cause: it is not a valid boolean.');
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - invalid "url" input'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.url, 'invalid');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid url input. Cause: it is not a valid URL.');
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - invalid "trimContent" input'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.trimContent, 'invalid');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid trimContent input. Cause: it is not a valid boolean.');
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - invalid "regex" input'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.regex, 'invalid');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid regex input. Cause: it is not a valid boolean.');
  },
});

Deno.test({
  name: testTitle('it should NOT return search results - invalid "skipCache" input'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');
    searchParams.append(SearchDocsQueryParams.skipCache, 'invalid');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid skipCache input. Cause: it is not a valid boolean.');
  },
});

function assertResponse(response: IResponse) {
  const responseDto = response.body as SearchDocsResponseDto;
  assert(responseDto.code === 200);
  assert(responseDto.results.length > 0);
  assert(responseDto.results[0].file);
  assert(responseDto.results[0].segment);
  assert(responseDto.results[0].found);
  assertEquals(responseDto.results[0].cache, false);
}
