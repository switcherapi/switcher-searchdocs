import { Context, Router } from '../deps.ts';
import { toSearchDocsDto } from '../dto/mapper.ts';
import { mapToSearchDocsRequestDto } from '../middleware/index.ts';
import Validator from '../middleware/validator.ts';
import { responseError, responseSuccess } from '../utils.ts';
import SearchDocsService from '../services/searchdocs.ts';
import { SearchDocsRequestDto } from '../dto/request.ts';

const router = new Router();
const service = new SearchDocsService({ expireDuration: 1000, size: 100 });

const { checkParam, required, hasLenght, isUrl, isBoolean, isNumeric } = Validator;

router.get(
  '/',
  checkParam('query', [required(), hasLenght({ max: 100 })]),
  checkParam('url', [isUrl()]),
  checkParam('previewLength', [isNumeric()]),
  checkParam('ignoreCase', [isBoolean()]),
  checkParam('trimContent', [isBoolean()]),
  checkParam('regex', [isBoolean()]),
  checkParam('skipCache', [isBoolean()]),
  mapToSearchDocsRequestDto,
  async (context: Context) => {
    try {
      const result = await service.skim(context.state.request as SearchDocsRequestDto);
      responseSuccess(context, toSearchDocsDto(result));
    } catch (error) {
      responseError(context, error, 500, true);
    }
  },
);

export default router;
