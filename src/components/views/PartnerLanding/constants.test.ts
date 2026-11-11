import assert from 'node:assert/strict';
import { describe, it } from 'node:test';

import {
  eventFromLanding,
  PARTNER_CAMPAIGN_LABEL,
  PARTNER_EVENT_TIME_ZONE,
} from './constants.ts';

describe('eventFromLanding', () => {
  it('uses the session times and door number from the landing payload', () => {
    const event = eventFromLanding({
      slug: 'capgemini',
      name: 'Capgemini',
      logo: null,
      email_domain: 'capgemini.com',
      enforce_email_domain: false,
      starts_at: '2026-12-03T11:00:00.000Z',
      ends_at: '2026-12-03T11:30:00.000Z',
      door_number: 3,
      lobby_name: 'capgemini',
    });
    assert.equal(event.doorNumber, 3);
    assert.equal(event.campaignLabel, PARTNER_CAMPAIGN_LABEL);
    assert.equal(event.timeZone, PARTNER_EVENT_TIME_ZONE);
    assert.equal(event.startsAt.toISOString(), '2026-12-03T11:00:00.000Z');
    assert.equal(event.endsAt.toISOString(), '2026-12-03T11:30:00.000Z');
  });
});
