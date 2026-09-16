import assert from 'node:assert/strict';
import { afterEach, describe, it } from 'node:test';

import { environment } from '../environment.ts';
import { getAppLinkProps, isInternalAppHref } from './appLinks.ts';

const originalIsNative = environment.isNative;

afterEach(() => {
  environment.isNative = originalIsNative;
});

describe('isInternalAppHref', () => {
  it('accepts root-relative app routes', () => {
    assert.equal(isInternalAppHref('/app/our-world/materials'), true);
    assert.equal(isInternalAppHref('/app'), true);
    assert.equal(isInternalAppHref('/app/help/faqs#technical-support'), true);
  });

  it('rejects external and hash-router hrefs', () => {
    assert.equal(isInternalAppHref('https://home.little-world.com'), false);
    assert.equal(isInternalAppHref('#/app/our-world/materials'), false);
    assert.equal(isInternalAppHref('/api/foo'), false);
    assert.equal(isInternalAppHref(undefined), false);
    assert.equal(isInternalAppHref(null), false);
  });
});

describe('getAppLinkProps', () => {
  it('routes internal app links through react-router on native', () => {
    environment.isNative = true;
    assert.deepEqual(getAppLinkProps('/app/our-world/materials'), {
      to: '/app/our-world/materials',
    });
  });

  it('keeps external links as new-tab anchors on native', () => {
    environment.isNative = true;
    assert.deepEqual(getAppLinkProps('https://forms.gle/abc'), {
      href: 'https://forms.gle/abc',
      target: '_blank',
    });
  });

  it('keeps anchors on the web, even for app routes', () => {
    environment.isNative = false;
    assert.deepEqual(getAppLinkProps('/app/our-world/materials'), {
      href: '/app/our-world/materials',
      target: '_blank',
    });
  });
});
