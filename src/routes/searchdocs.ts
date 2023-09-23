import { Context, Router } from '../deps.ts';
import SearchDocsService from '../services/searchdocs.ts';
import { responseError } from '../utils.ts';

const router = new Router();
const service = new SearchDocsService({ expireDuration: 1000, size: 100 });

router.get('/', async (context: Context) => {
  try {
    // TODO: Replace this with real search parameters
    const result = await service.skim({
      files: ['README.md'],
      url: 'https://raw.githubusercontent.com/petruki/skimming/master/test/fixtures/',
      query: 'Skimming',
      previewLength: 0,
      ignoreCase: false,
      trimContent: false,
      regex: false,
      skipCache: false,
    });

    context.response.body = result;
    context.response.status = 200;
  } catch (error) {
    responseError(context, error, 500);
  }
});

export default router;
