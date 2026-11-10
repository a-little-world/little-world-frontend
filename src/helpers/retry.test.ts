import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { MAX_RETRIES, retry } from './retry.ts';

const failing =
  (calls: { count: number }, succeedOn = Infinity) =>
  () => {
    calls.count++;
    return calls.count >= succeedOn
      ? Promise.resolve('ok')
      : Promise.reject(new Error('fail'));
  };

describe('retry', () => {
  it('returns once fn succeeds', async () => {
    const calls = { count: 0 };
    const result = await retry(
      failing(calls, 3),
      new AbortController().signal,
      0,
    );
    assert.equal(result, 'ok');
    assert.equal(calls.count, 3);
  });

  it('gives up after MAX_RETRIES retries', async () => {
    const calls = { count: 0 };
    await assert.rejects(
      retry(failing(calls), new AbortController().signal, 0),
    );
    assert.equal(calls.count, MAX_RETRIES + 1);
  });

  it('stops retrying once aborted', async () => {
    const calls = { count: 0 };
    const controller = new AbortController();
    const result = retry(failing(calls), controller.signal, 0);
    controller.abort();
    await assert.rejects(result);
    assert.equal(calls.count, 1);
  });
});
