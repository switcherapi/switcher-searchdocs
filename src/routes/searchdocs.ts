import { Context, Router } from '../deps.ts';
import { toSearchDocsDto } from '../dto/mapper.ts';
import SearchDocsService from '../services/searchdocs.ts';
import { responseError, responseSuccess } from '../utils.ts';

const router = new Router();
const service = new SearchDocsService({ expireDuration: 1000, size: 100 });

router.get('/', async (context: Context) => {
  try {
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

    responseSuccess(context, toSearchDocsDto(result));
  } catch (error) {
    responseError(context, error, 500);
  }
});

export default router;
