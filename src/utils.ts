import { bold, Context } from './deps.ts';
import { ResponseDto } from './dto/response.ts';

const Level = Object.freeze({
  INFO: 0,
  DEBUG: 1,
  ERROR: 2,
});

export const responseSuccess = ({ response }: Context, body: ResponseDto) => {
  response.status = body.code || 200;
  response.body = body;
};

export const responseError = ({ response }: Context, error: Error, code: number, showStack?: boolean) => {
  logger('ERROR', 'Route', error, showStack);
  response.status = code;
  response.body = { error: error.message };
};

export const logger = (level: string, component: string, content: string | object, showStack?: boolean) => {
  let data;

  const currentLevel = Deno.env.get('LOG_LEVEL') || 'INFO';
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
};
