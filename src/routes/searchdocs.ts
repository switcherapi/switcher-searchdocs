import { Context, Router } from '../deps.ts';
import { toSearchDocsRequestDto, toSearchDocsResponseDto } from '../dto/mapper.ts';
import Validator from '../middleware/validator.ts';
import { getEnv, responseError, responseSuccess } from '../utils.ts';
import SearchDocsService from '../services/searchdocs.ts';
import { SearchDocsQueryParams } from '../dto/request.ts';

const router = new Router();
let service: SearchDocsService;

const { ignoreCase, previewLength, query, regex, skipCache, trimContent, url } = SearchDocsQueryParams;
const { checkParam, required, hasLenght, isUrl, isBoolean, isNumeric } = Validator;

router.get(
  '/',
  checkParam([
    { key: query, validators: [required(), hasLenght({ max: 100 })] },
    { key: url, validators: [isUrl()] },
    { key: previewLength, validators: [isNumeric()] },
    { key: ignoreCase, validators: [isBoolean()] },
    { key: trimContent, validators: [isBoolean()] },
    { key: regex, validators: [isBoolean()] },
    { key: skipCache, validators: [isBoolean()] },
  ]),
  async (context: Context) => {
    try {
      const request = toSearchDocsRequestDto(context);
      const result = await getService().skim(request);
      responseSuccess(context, toSearchDocsResponseDto(result));
    } catch (error) {
      responseError(context, error, 500, true);
    }
  },
);

const getService = () => {
  if (!service) {
    const expireDuration = parseInt(getEnv('APP_CACHE_EXP_DURATION', '30'));
    const size = parseInt(getEnv('APP_CACHE_SIZE', '100'));
    service = new SearchDocsService({ expireDuration, size });
  }

  return service;
};

export default router;
