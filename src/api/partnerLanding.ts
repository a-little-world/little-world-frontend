import {
  getPartnerLandingEndpoint,
  getPartnerRegisterEndpoint,
} from './endpoints';
import { apiFetch } from './helpers';

export interface PartnerLanding {
  slug: string;
  name: string;
  logo: string | null;
  email_domain: string | null;
  starts_at: string;
  ends_at: string;
  door_number: number;
  lobby_name: string;
}

export const fetchPartnerLanding = (slug?: string) =>
  apiFetch<PartnerLanding>(getPartnerLandingEndpoint(slug));

export const registerPartner = (
  slug: string | undefined,
  body: { email: string; newsletter_subscribed: boolean },
) =>
  apiFetch<{ ok: true; personal_path?: string }>(
    getPartnerRegisterEndpoint(slug),
    {
      method: 'POST',
      useTagsOnly: true,
      body,
    },
  );
