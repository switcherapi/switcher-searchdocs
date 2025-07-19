import app from '../../src/app.ts';
import { assertObjectMatch, superoak } from '../deps.ts';
import apiDocs from '../../src/api-docs/swagger-document.ts';

Deno.test({
  name: 'API-Docs route - it should return ok',
  async fn() {
    const request = await superoak(app);
    const response = await request.get('/swagger.json').expect(200);

    assertObjectMatch(response.body, apiDocs);
  },
});
