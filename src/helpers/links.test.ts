import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isInternalLink } from './links';

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
