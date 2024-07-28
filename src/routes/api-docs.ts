import { type Context, Router } from '../deps.ts';
import swaggerDocument from '../api-docs/swagger-document.ts';

const router = new Router();

router.get('/swagger.json', (context: Context) => {
  context.response.status = 200;
  context.response.body = swaggerDocument;
});

export default router;
