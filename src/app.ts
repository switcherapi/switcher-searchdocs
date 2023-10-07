import { Application, load } from './deps.ts';
import { responseTime, responseTimeLog } from './middleware/index.ts';

await load({ export: true, envPath: getEnv('ENV_PATH', '.env') });

import routerApi from './routes/api.ts';
import routerSearchDocs from './routes/searchdocs.ts';
import { getEnv } from './utils.ts';

const app = new Application();

app.use(responseTimeLog);
app.use(responseTime);
app.use(routerApi.routes());
app.use(routerSearchDocs.routes());

export default app;
