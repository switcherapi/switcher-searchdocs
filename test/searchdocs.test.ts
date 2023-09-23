import app from '../src/app.ts';
import { assert, superoak } from './deps.ts';

const testTitle = (description: string) => `SearchDocs route - ${description}`;

Deno.test({
  name: testTitle('it should return search results'),
  async fn() {
    const request = await superoak(app);
    const response = await request.get(`/`)
      .send()
      .expect(200);

    assert(response.body);
    assert(response.body.length === 1);
    assert(response.body[0].file === 'README.md');
    assert(response.body[0].segment.length);
    assert(response.body[0].found);
    assert(response.body[0].cache === false);
  },
});
