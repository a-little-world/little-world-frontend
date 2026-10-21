import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { describe, it } from 'node:test';

const LOCALES = ['en', 'de'];
const ABSOLUTE_URL = /^(https?:)?\/\//;

const strings = (value: unknown): string[] =>
  typeof value === 'string'
    ? [value]
    : Object.values(value as object).flatMap(strings);

describe('locale links', () => {
  LOCALES.forEach(locale => {
    it(`${locale}: only absolute URLs open in a new tab`, () => {
      const translations = JSON.parse(
        readFileSync(new URL(`./${locale}.json`, import.meta.url), 'utf8'),
      );
      const offenders = strings(translations)
        .flatMap(text => [...text.matchAll(/<a (\{[^}]*\})>/g)])
        .map(([, attributes]) => JSON.parse(attributes))
        .filter(
          ({ href, target }) => target === '_blank' && !ABSOLUTE_URL.test(href),
        )
        .map(({ href }) => href);

      assert.deepEqual(offenders, []);
    });
  });
});
