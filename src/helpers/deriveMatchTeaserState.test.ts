import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  matchTeaserShowsDescription,
  mapMatchTeaserStateToViewModel,
} from './matchTeaserViewModel.ts';
import {
  QUIET_AFTER_DAYS,
  deriveMatchTeaserState,
} from './deriveMatchTeaserState.ts';

const NOW = new Date('2026-07-14T12:00:00.000Z');

const baseInput = {
  cycleComplete: false,
  isActive: true,
  messageCount: 4,
  callCount: 2,
  monthsTogether: 3,
  weekStreak: 3,
  lastActivityAt: new Date('2026-07-10T12:00:00.000Z'),
};

describe('deriveMatchTeaserState', () => {
  it('prioritises cycle_complete over all other states', () => {
    const state = deriveMatchTeaserState(
      {
        ...baseInput,
        cycleComplete: true,
        messageCount: 0,
        callCount: 0,
      },
      NOW,
    );

    assert.equal(state.state, 'cycle_complete');
  });

  it('returns no_message when neither side has sent a message', () => {
    const state = deriveMatchTeaserState(
      {
        ...baseInput,
        messageCount: 0,
        callCount: 0,
        lastActivityAt: null,
      },
      NOW,
    );

    assert.equal(state.state, 'no_message');
  });

  it('returns no_call when messages exist but there has been no call', () => {
    const state = deriveMatchTeaserState(
      {
        ...baseInput,
        messageCount: 2,
        callCount: 0,
        lastActivityAt: new Date('2026-01-01T12:00:00.000Z'),
      },
      NOW,
    );

    assert.equal(state.state, 'no_call');
    if (state.state === 'no_call') {
      assert.equal(state.messages, 2);
    }
  });

  it('returns gone_quiet when activity is exactly QUIET_AFTER_DAYS old', () => {
    const lastActivityAt = new Date(NOW);
    lastActivityAt.setDate(lastActivityAt.getDate() - QUIET_AFTER_DAYS);

    const state = deriveMatchTeaserState(
      {
        ...baseInput,
        callCount: 1,
        lastActivityAt,
      },
      NOW,
    );

    assert.equal(state.state, 'gone_quiet');
    if (state.state === 'gone_quiet') {
      assert.equal(state.daysQuiet, QUIET_AFTER_DAYS);
    }
  });

  it('returns active when the match is ongoing and recently active', () => {
    const state = deriveMatchTeaserState(baseInput, NOW);

    assert.equal(state.state, 'active');
    if (state.state === 'active') {
      assert.equal(state.calls, 2);
      assert.equal(state.weekStreak, 3);
    }
  });

  it('does not return gone_quiet one day before the quiet threshold', () => {
    const lastActivityAt = new Date(NOW);
    lastActivityAt.setDate(lastActivityAt.getDate() - (QUIET_AFTER_DAYS - 1));

    const state = deriveMatchTeaserState(
      {
        ...baseInput,
        callCount: 1,
        lastActivityAt,
      },
      NOW,
    );

    assert.equal(state.state, 'active');
  });
});

describe('matchTeaserShowsDescription', () => {
  it('shows description only for no_message', () => {
    assert.equal(matchTeaserShowsDescription('no_message'), true);
    assert.equal(matchTeaserShowsDescription('active'), false);
    assert.equal(matchTeaserShowsDescription(null), true);
  });
});

describe('mapMatchTeaserStateToViewModel', () => {
  it('maps no_call to video icon and translation keys', () => {
    const state = deriveMatchTeaserState(
      {
        ...baseInput,
        messageCount: 2,
        callCount: 0,
        lastActivityAt: new Date('2026-01-01T12:00:00.000Z'),
      },
      NOW,
    );
    const viewModel = mapMatchTeaserStateToViewModel(state, '/call-setup');

    assert.equal(viewModel.kind, 'no_call');
    assert.equal(viewModel.icon, 'video');
    assert.equal(viewModel.variant, 'accent');
    assert.equal(viewModel.titleKey, 'matchCard.teaser.no_call.title');
    assert.equal(viewModel.sublineKey, 'matchCard.teaser.no_call.subline');
    assert.deepEqual(viewModel.sublineParams, { messages: 2 });
    assert.equal(viewModel.href, '/call-setup');
  });

  it('uses streak subline key when weekStreak is at least 2', () => {
    const state = deriveMatchTeaserState(baseInput, NOW);
    const viewModel = mapMatchTeaserStateToViewModel(state, '/stats');

    assert.equal(viewModel.kind, 'active');
    assert.equal(viewModel.icon, 'heart');
    assert.equal(viewModel.variant, 'subtle');
    assert.equal(
      viewModel.sublineKey,
      'matchCard.teaser.active.subline_with_streak',
    );
    assert.deepEqual(viewModel.sublineParams, { calls: 2, weeks: 3 });
    assert.equal(viewModel.href, '/stats');
  });
});
