import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { sanitizeNext } from './routes.ts';

describe('sanitizeNext', () => {
  it('accepts internal app paths, with query and fragment', () => {
    assert.equal(sanitizeNext('/app/events'), '/app/events');
    assert.equal(
      sanitizeNext('/app/match/123?tab=overview'),
      '/app/match/123?tab=overview',
    );
    assert.equal(sanitizeNext('/app/call/abc#x'), '/app/call/abc#x');
  });

  it('rejects missing, empty and non-absolute targets', () => {
    assert.equal(sanitizeNext(null), null);
    assert.equal(sanitizeNext(undefined), null);
    assert.equal(sanitizeNext(''), null);
    assert.equal(sanitizeNext('app/events'), null);
    assert.equal(sanitizeNext('https://evil.com'), null);
    assert.equal(sanitizeNext('//evil.com'), null);
  });

  it('rejects targets browsers normalise off-site (backslash/control chars)', () => {
    // These are the values callers actually hold: `URLSearchParams.get` decodes
    // `/%5C` and `/%09` before `sanitizeNext` sees them. Each starts with a
    // single `/` but the browser resolves it to https://evil.com, and React
    // Router would fall back to `window.location.assign`.
    assert.equal(sanitizeNext('/\\evil.com'), null);
    assert.equal(sanitizeNext('/\t/evil.com'), null);
    assert.equal(sanitizeNext('/\n/evil.com'), null);
    assert.equal(sanitizeNext('/\r/evil.com'), null);
    assert.equal(sanitizeNext('/\\/evil.com'), null);
  });

  it('keeps still-percent-encoded paths on-site', () => {
    // Not decoded by the callers, and the browser keeps them on-origin.
    assert.equal(sanitizeNext('/%5Cevil.com'), '/%5Cevil.com');
    assert.equal(sanitizeNext('/%2F%2Fevil.com'), '/%2F%2Fevil.com');
  });

  it('rejects public routes to avoid redirect loops', () => {
    assert.equal(sanitizeNext('/login'), null);
    assert.equal(sanitizeNext('/login?next=/app'), null);
    assert.equal(sanitizeNext('/sign-up'), null);
    assert.equal(sanitizeNext('/forgot-password'), null);
    assert.equal(sanitizeNext('/reset-password/uuid/token'), null);
    assert.equal(sanitizeNext('/email-preferences/hash'), null);
  });

  it('allows app routes whose first segment is not public', () => {
    assert.equal(sanitizeNext('/app/login'), '/app/login');
  });
});
