import { bold, Context } from './deps.ts';
import { ResponseDto } from './dto/response.ts';

const Level = Object.freeze({
  INFO: 0,
  DEBUG: 1,
  ERROR: 2,
});

export function responseSuccess({ response }: Context, body: ResponseDto) {
  response.status = body.code || 200;
  response.body = body;
}

export function responseError({ response }: Context, error: Error, code: number, showStack?: boolean) {
  logger('ERROR', 'Route', error, showStack);
  response.status = code;
  response.body = { error: error.message };
  return false;
}

export function logger(level: string, component: string, content: string | object, showStack?: boolean) {
  let data;

  const currentLevel = getEnv('LOG_LEVEL', 'INFO');
  const levels = Object.keys(Level);
  const currentLevelIndex = levels.indexOf(currentLevel);
  const levelIndex = levels.indexOf(level);

  if (currentLevelIndex >= levelIndex || levelIndex === Level.ERROR) {
    if (content instanceof Error) {
      if (showStack) {
        console.log(content.stack);
      }

      content = content.message;
    } else if (typeof content === 'object') {
      content = JSON.stringify(content, null, 2);
    }

    data = `${bold(levels[levelIndex])} ${component}: ${content}`;
    console.log(data);
  }

  return data;
}

export function getParam(params: URLSearchParams, key: string, or: string | number) {
  if (params.has(key)) {
    return params.get(key)?.trim()!;
  }

  return or;
}

export function getBooleanParam(params: URLSearchParams, key: string, or: boolean) {
  if (params.has(key)) {
    return params.get(key)?.trim() === 'true';
  }

  return or;
}

export function getEnv<T>(key: string, or: T): T {
  return Deno.env.get(key) as T || or;
}
