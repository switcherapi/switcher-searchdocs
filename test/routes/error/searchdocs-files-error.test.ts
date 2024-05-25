import app from '../../../src/app.ts';
import { SearchDocsQueryParams } from '../../../src/dto/request.ts';
import { assertEquals, superoak } from '../../deps.ts';

Deno.test({
  name: 'SearchDocs route error - it should NOT return search results - file not found',
  async fn() {
    Deno.env.set('APP_FILES', 'NOT_FOUND_FILE.md');

    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(500);

    assertEquals(
      response.body.error,
      'No content found at https://raw.githubusercontent.com/petruki/skimming/master/NOT_FOUND_FILE.md.',
    );

    // teardown
    Deno.env.set('APP_FILES', 'README.md');
  },
});
