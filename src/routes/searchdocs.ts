import { Context, Router } from '../deps.ts';
import { toSearchDocsDto } from '../dto/mapper.ts';
import { mapToSearchDocsRequestDto } from '../middleware/index.ts';
import Validator from '../middleware/validator.ts';
import { responseError, responseSuccess } from '../utils.ts';
import SearchDocsService from '../services/searchdocs.ts';
import { SearchDocsQueryParams, SearchDocsRequestDto } from '../dto/request.ts';

const router = new Router();
const expireDuration = parseInt(Deno.env.get('CACHE_EXPIRE_DURATION') || '30000'); // 30s
const size = parseInt(Deno.env.get('CACHE_SIZE') || '100');
const service = new SearchDocsService({ expireDuration, size });

const { checkParam, required, hasLenght, isUrl, isBoolean, isNumeric } = Validator;

router.get(
  '/',
  checkParam([
    { key: SearchDocsQueryParams.query, validators: [required(), hasLenght({ max: 100 })] },
    { key: SearchDocsQueryParams.url, validators: [isUrl()] },
    { key: SearchDocsQueryParams.previewLength, validators: [isNumeric()] },
    { key: SearchDocsQueryParams.ignoreCase, validators: [isBoolean()] },
    { key: SearchDocsQueryParams.trimContent, validators: [isBoolean()] },
    { key: SearchDocsQueryParams.regex, validators: [isBoolean()] },
    { key: SearchDocsQueryParams.skipCache, validators: [isBoolean()] },
  ]),
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
