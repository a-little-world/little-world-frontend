import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import { isUserFieldChange } from './formWatch.ts';

describe('isUserFieldChange', () => {
  it('accepts a real field change', () => {
    assert.equal(
      isUserFieldChange({ name: 'push_notifications_enabled', type: 'change' }),
      true,
    );
  });

  it('ignores handleSubmit / setError form-state updates that have no field name', () => {
    assert.equal(isUserFieldChange({ type: 'change' }), false);
    assert.equal(isUserFieldChange({ name: undefined, type: 'change' }), false);
    assert.equal(isUserFieldChange({}), false);
    assert.equal(isUserFieldChange(undefined), false);
  });

  it('ignores non-change events even when a name is present', () => {
    assert.equal(
      isUserFieldChange({ name: 'push_notifications_enabled', type: 'blur' }),
      false,
    );
    assert.equal(
      isUserFieldChange({
        name: 'push_notifications_enabled',
        type: undefined,
      }),
      false,
    );
  });
});
