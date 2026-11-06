export const PARTNER_EVENT_TIME_ZONE = 'Europe/Berlin';
export const PARTNER_CAMPAIGN_LABEL = '24 Gespräche · Adventskalender 2026';

export type PartnerEvent = {
  doorNumber: number;
  campaignLabel: string;
  startsAt: Date;
  endsAt: Date;
  timeZone: string;
};

export const eventFromLanding = (landing: {
  door_number: number;
  starts_at: string;
  ends_at: string;
}): PartnerEvent => ({
  doorNumber: landing.door_number,
  campaignLabel: PARTNER_CAMPAIGN_LABEL,
  startsAt: new Date(landing.starts_at),
  endsAt: new Date(landing.ends_at),
  timeZone: PARTNER_EVENT_TIME_ZONE,
});
