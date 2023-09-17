import { assert, assertEquals } from './deps.ts';
import { logger } from '../src/utils.ts';

const testTitle = (description: string) => `Utils (logger) - ${description}`;

const component = 'component';
const content = 'some content';

Deno.test({
  name: testTitle('it should log INFO'),
  fn() {
    Deno.env.delete('LOG_LEVEL');
    const log = logger('INFO', component, content);
    assert(log);
  },
});

Deno.test({
  name: testTitle('it should log INFO when level is DEBUG'),
  fn() {
    Deno.env.set('LOG_LEVEL', 'DEBUG');
    const log = logger('INFO', component, content);
    assert(log);
  },
});

Deno.test({
  name: testTitle('it should NOT log DEBUG when level is INFO'),
  fn() {
    Deno.env.set('LOG_LEVEL', 'INFO');
    const log = logger('DEBUG', component, content);
    assertEquals(log, undefined);
  },
});

Deno.test({
  name: testTitle('it should always log ERROR'),
  fn() {
    Deno.env.set('LOG_LEVEL', 'INFO');
    const log = logger('ERROR', component, content);
    assert(log);
  },
});

Deno.test({
  name: testTitle('it should log ERROR object'),
  fn() {
    const log = logger('INFO', component, new Error(content));
    assert(log);
  },
});

Deno.test({
  name: testTitle('it should log INFO JSON object'),
  fn() {
    const log = logger('INFO', component, {
      foo: 'bar',
    });
    assert(log);
  },
});
