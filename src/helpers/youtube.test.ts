import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { extractYoutubeId } from './youtube.ts';

describe('extractYoutubeId', () => {
  const cases = [
    ['HEAtdAeYiQg', 'HEAtdAeYiQg'],
    ['HEAtdAeYiQg?si=CFfTat_UccuT-OL6', 'HEAtdAeYiQg'],
    ['https://youtu.be/HEAtdAeYiQg?si=x', 'HEAtdAeYiQg'],
    ['https://www.youtube.com/watch?v=HEAtdAeYiQg', 'HEAtdAeYiQg'],
    ['https://www.youtube.com/embed/HEAtdAeYiQg?si=x', 'HEAtdAeYiQg'],
  ];

  cases.forEach(([input, expected]) => {
    it(input, () => {
      assert.equal(extractYoutubeId(input), expected);
    });
  });
});
