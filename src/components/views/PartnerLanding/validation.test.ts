import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { validatePartnerEmail } from './validation.ts';

describe('validatePartnerEmail', () => {
  it('requires a value only after submit-style checks', () => {
    assert.equal(validatePartnerEmail('', 'capgemini.com'), 'empty');
    assert.equal(validatePartnerEmail('   ', 'capgemini.com'), 'empty');
  });

  it('rejects malformed addresses', () => {
    assert.equal(validatePartnerEmail('ada@', 'capgemini.com'), 'invalid');
    assert.equal(validatePartnerEmail('ada', 'capgemini.com'), 'invalid');
  });

  it('rejects a different company domain', () => {
    assert.equal(
      validatePartnerEmail('ada@other.com', 'capgemini.com'),
      'domain',
    );
  });

  it('accepts the partner domain, ignoring case and surrounding space', () => {
    assert.equal(
      validatePartnerEmail('  Ada.Lovelace@Capgemini.com  ', 'capgemini.com'),
      null,
    );
  });

  it('skips domain matching when the company has none', () => {
    assert.equal(validatePartnerEmail('ada@other.com', null), null);
  });
});
