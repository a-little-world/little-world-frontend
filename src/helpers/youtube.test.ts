import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { extractYoutubeId } from './youtube.ts';

describe('extractYoutubeId', () => {
  it('accepts raw ids and common URL forms', () => {
    assert.equal(extractYoutubeId('M7lc1UVf-VE'), 'M7lc1UVf-VE');
    assert.equal(
      extractYoutubeId('https://youtu.be/M7lc1UVf-VE'),
      'M7lc1UVf-VE',
    );
    assert.equal(
      extractYoutubeId('https://www.youtube.com/watch?v=M7lc1UVf-VE'),
      'M7lc1UVf-VE',
    );
    assert.equal(
      extractYoutubeId('https://www.youtube.com/embed/M7lc1UVf-VE'),
      'M7lc1UVf-VE',
    );
    assert.equal(
      extractYoutubeId('https://www.youtube.com/shorts/M7lc1UVf-VE'),
      'M7lc1UVf-VE',
    );
  });

  it('returns null for unrecognised input', () => {
    assert.equal(extractYoutubeId('not a video'), null);
    assert.equal(extractYoutubeId('https://example.com/video'), null);
  });
});
