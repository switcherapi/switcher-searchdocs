import { type Context, Router, ValidatorFn, ValidatorMiddleware } from '../deps.ts';
import { toSearchDocsRequestDto, toSearchDocsResponseDto } from '../dto/mapper.ts';
import { getEnv, responseError, responseSuccess } from '../utils.ts';
import SearchDocsService from '../services/searchdocs.ts';
import { SearchDocsQueryParams } from '../dto/request.ts';

const router = new Router();
let service: SearchDocsService;

const { ignoreCase, previewLength, query, regex, skipCache, trimContent } = SearchDocsQueryParams;
const { query: checkQuery, check, useErrorHandler } = ValidatorMiddleware.createMiddleware();
const { hasLenght, isBoolean, isNumeric } = ValidatorFn.createValidator();

useErrorHandler((context: Context, error: string) => {
  return responseError(context, new Error(error), 422);
});

router.get(
  '/',
  checkQuery(
    check(query).ifValue(hasLenght({ max: 100 })),
    check(previewLength).maybe().ifValue(isNumeric()),
    check(ignoreCase).maybe().ifValue(isBoolean()),
    check(trimContent).maybe().ifValue(isBoolean()),
    check(regex).maybe().ifValue(isBoolean()),
    check(skipCache).maybe().ifValue(isBoolean()),
  ),
  async (context: Context) => {
    try {
      const request = toSearchDocsRequestDto(context);
      const result = await getService().skim(request);
      responseSuccess(context, toSearchDocsResponseDto(result));
    } catch (error) {
      responseError(context, error as Error, 500, true);
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
