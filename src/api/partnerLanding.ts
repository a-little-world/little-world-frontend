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
}

export const fetchPartnerLanding = (slug: string) =>
  apiFetch<PartnerLanding>(getPartnerLandingEndpoint(slug));

export const registerPartner = (
  slug: string,
  body: { email: string; newsletter_subscribed: boolean },
) =>
  apiFetch(getPartnerRegisterEndpoint(slug), {
    method: 'POST',
    useTagsOnly: true,
    body,
  });
