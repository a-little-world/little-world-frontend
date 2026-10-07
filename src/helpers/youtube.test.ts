import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  extractYoutubeId,
  FALLBACK_EMBEDDER_ORIGIN,
  getEmbedderOrigin,
} from './youtube.ts';

describe('getEmbedderOrigin', () => {
  it('keeps a real http(s) page origin', () => {
    assert.equal(
      getEmbedderOrigin('https://stage.little-world.com'),
      'https://stage.little-world.com',
    );
    assert.equal(
      getEmbedderOrigin('http://localhost:3000'),
      'http://localhost:3000',
    );
  });

  it('falls back when the page has no origin (native file:// WebView)', () => {
    assert.equal(getEmbedderOrigin('null'), FALLBACK_EMBEDDER_ORIGIN);
    assert.equal(getEmbedderOrigin('file://'), FALLBACK_EMBEDDER_ORIGIN);
    assert.equal(getEmbedderOrigin(''), FALLBACK_EMBEDDER_ORIGIN);
  });
});

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
