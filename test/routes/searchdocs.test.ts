import app from '../../src/app.ts';
import { SearchDocsResponseDto } from '../../src/dto/response.ts';
import { assert, assertEquals, superoak } from '../deps.ts';

const testTitle = (description: string) => `SearchDocs route - ${description}`;

Deno.test({
  name: testTitle('it should return search results'),
  async fn() {
    const searchParams = new URLSearchParams();
    searchParams.append('query', 'Skimming');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(200);

    const responseDto = response.body as SearchDocsResponseDto;
    assert(responseDto.code === 200);
    assert(responseDto.results.length > 0);
    assert(responseDto.results[0].file);
    assert(responseDto.results[0].segment);
    assert(responseDto.results[0].found);
    assertEquals(responseDto.results[0].cache, false);
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
    searchParams.append('query', 'A'.repeat(101));

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
    searchParams.append('query', 'Skimming');
    searchParams.append('previewLength', 'invalid');

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
    searchParams.append('query', 'Skimming');
    searchParams.append('ignoreCase', 'invalid');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(422);

    assertEquals(response.body.error, 'Invalid ignoreCase input. Cause: it is not a valid boolean.');
  },
});
