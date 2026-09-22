import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { getAppLinkProps, isInternalLink } from './links.ts';

describe('isInternalLink', () => {
  it('treats root-absolute app paths as internal', () => {
    assert.equal(isInternalLink('/app'), true);
    assert.equal(isInternalLink('/app/settings'), true);
    assert.equal(isInternalLink('/app/events#15'), true);
    assert.equal(isInternalLink('/login'), true);
    assert.equal(isInternalLink('/reset-password/userId/token'), true);
    assert.equal(isInternalLink('/'), true);
  });

  it('treats everything else as external', () => {
    assert.equal(isInternalLink('//evil.com/x'), false);
    assert.equal(isInternalLink('https://home.little-world.com/'), false);
    assert.equal(isInternalLink('http://lernox.de/'), false);
    assert.equal(isInternalLink('mailto:support@little-world.com'), false);
    assert.equal(isInternalLink('../other-page'), false);
    assert.equal(isInternalLink('relative/path'), false);
    assert.equal(isInternalLink(undefined), false);
    assert.equal(isInternalLink(''), false);
  });
});

describe('getAppLinkProps', () => {
  it('routes internal app links through react-router (in-SPA, no new tab)', () => {
    assert.deepEqual(getAppLinkProps('/app'), { to: '/app' });
    assert.deepEqual(getAppLinkProps('/login'), { to: '/login' });
  });

  it('falls back to a same-tab href outside a router', () => {
    assert.deepEqual(getAppLinkProps('/login', false), {
      href: '/login',
      target: '_self',
    });
  });

  it('keeps external links as href + target=_blank', () => {
    assert.deepEqual(getAppLinkProps('https://home.little-world.com/stories'), {
      href: 'https://home.little-world.com/stories',
      target: '_blank',
    });
    assert.deepEqual(getAppLinkProps('mailto:support@little-world.com'), {
      href: 'mailto:support@little-world.com',
      target: '_blank',
    });
  });
});
