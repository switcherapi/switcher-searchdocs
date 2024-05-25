import { Context, Router, ValidatorFn, ValidatorMiddleware } from '../deps.ts';
import { toSearchDocsRequestDto, toSearchDocsResponseDto } from '../dto/mapper.ts';
import { getEnv, responseError, responseSuccess } from '../utils.ts';
import SearchDocsService from '../services/searchdocs.ts';
import { SearchDocsQueryParams } from '../dto/request.ts';

const router = new Router();
let service: SearchDocsService;

const { ignoreCase, previewLength, query, regex, skipCache, trimContent } = SearchDocsQueryParams;
const { query: checkQuery, useErrorHandler } = ValidatorMiddleware.createMiddleware();
const { hasLenght, isBoolean, isNumeric } = ValidatorFn.createValidator();

useErrorHandler((context: Context, error: string) => {
  return responseError(context, new Error(error), 422);
});

router.get(
  '/',
  checkQuery([
    { key: query, validators: [hasLenght({ max: 100 })] },
    { key: previewLength, validators: [isNumeric()], optional: true },
    { key: ignoreCase, validators: [isBoolean()], optional: true },
    { key: trimContent, validators: [isBoolean()], optional: true },
    { key: regex, validators: [isBoolean()], optional: true },
    { key: skipCache, validators: [isBoolean()], optional: true },
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

function getService() {
  if (!service) {
    const url = getEnv('APP_URL', '');
    const files = getEnv('APP_FILES', '').split(',');
    const expireDuration = parseInt(getEnv('APP_CACHE_EXP_DURATION', '30'));
    const size = parseInt(getEnv('APP_CACHE_SIZE', '100'));

    service = new SearchDocsService({ url, files, expireDuration, size });
  }

  return service;
}

export default router;
