import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MAX_RETRIES, retry } from './retry.ts';

const createFailing = (succeedOn = Infinity) => {
  const calls = { count: 0 };
  const fn = () => {
    calls.count += 1;
    return calls.count >= succeedOn
      ? Promise.resolve('ok')
      : Promise.reject(new Error('fail'));
  };
  return { calls, fn };
};

describe('retry', () => {
  it('returns once fn succeeds', async () => {
    const { calls, fn } = createFailing(3);
    const result = await retry(fn, new AbortController().signal, 0);
    assert.equal(result, 'ok');
    assert.equal(calls.count, 3);
  });

  it('gives up after MAX_RETRIES retries', async () => {
    const { calls, fn } = createFailing();
    await assert.rejects(retry(fn, new AbortController().signal, 0));
    assert.equal(calls.count, MAX_RETRIES + 1);
  });

  it('stops retrying once aborted', async () => {
    const { calls, fn } = createFailing();
    const controller = new AbortController();
    const result = retry(fn, controller.signal, 0);
    controller.abort();
    await assert.rejects(result);
    assert.equal(calls.count, 1);
  });
});
