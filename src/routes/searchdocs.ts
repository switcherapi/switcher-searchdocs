import { Context, Router } from '../deps.ts';
import { toSearchDocsDto } from '../dto/mapper.ts';
import { requestSanitizer } from '../middleware/index.ts';
import { responseError, responseSuccess } from '../utils.ts';
import SearchDocsService from '../services/searchdocs.ts';

const router = new Router();
const service = new SearchDocsService({ expireDuration: 1000, size: 100 });

router.get('/', requestSanitizer, async (context: Context) => {
  try {
    const result = await service.skim(context.state.request);
    responseSuccess(context, toSearchDocsDto(result));
  } catch (error) {
    responseError(context, error, 500, true);
  }
});

export default router;
