import { Application, load } from './deps.ts';
import { responseTime, responseTimeLog } from './middleware/index.ts';

await load({ export: true, envPath: getEnv('ENV_PATH', '.env') });

import routerApi from './routes/api.ts';
import routerApidocs from './routes/api-docs.ts';
import routerSearchDocs from './routes/searchdocs.ts';
import RateLimit from './middleware/rate-limit.ts';
import Helmet from './middleware/helmet.ts';
import { getEnv } from './utils.ts';

const app = new Application();
const rateLimit = new RateLimit();
const helmet = new Helmet();
const whitelist = ['/api/check', '/swagger.json'];

app.use(helmet.middleware());
app.use(rateLimit.middleware({
  limit: Number(getEnv('APP_RATE_LIMIT', '1000')),
  windowMs: Number(getEnv('APP_RATE_LIMIT_WINDOW', '60000')),
}, whitelist));

app.use(responseTimeLog);
app.use(responseTime);
app.use(routerApi.routes());
app.use(routerSearchDocs.routes());
app.use(routerApidocs.routes());

export default app;
