import app from '../../../src/app.ts';
import { SearchDocsQueryParams } from '../../../src/dto/request.ts';
import { assert, superoak } from '../../deps.ts';

Deno.test({
  name: 'SearchDocs route error - it should NOT return search results - url is not set',
  async fn() {
    Deno.env.set('APP_URL', 'http://localhost:8000');

    const searchParams = new URLSearchParams();
    searchParams.append(SearchDocsQueryParams.query, 'Skimming');

    const request = await superoak(app);
    const response = await request.get(`/?${searchParams.toString()}`)
      .send()
      .expect(500);

    assert(response.body.error.includes('error sending request for url (http://localhost:8000/README.md)'));

    // teardown
    Deno.env.set('APP_URL', 'https://raw.githubusercontent.com/petruki/skimming/master/');
  },
});
