import {
  getPartnerLandingEndpoint,
  getPartnerRegisterEndpoint,
  PARTNER_ACCESS_ENDPOINT,
  PARTNER_VERIFY_ENDPOINT,
} from './endpoints';
import { apiFetch } from './helpers';

export interface PartnerLanding {
  slug: string;
  name: string;
  logo: string | null;
  email_domain: string | null;
  enforce_email_domain: boolean;
  starts_at: string;
  ends_at: string;
  door_number: number;
  lobby_name: string;
}

const isPartnerLanding = (data: unknown): data is PartnerLanding =>
  Boolean(data) &&
  typeof data === 'object' &&
  typeof (data as PartnerLanding).starts_at === 'string';

/**
 * A landing, or an error for anything else. `apiFetch` turns a non-JSON body into `null`: a slug
 * Django's `<slug:slug>` route does not match (e.g. one with `:`) falls through to the catch-all,
 * which redirects to /app/, and the fetch follows that to an HTML page. Without the check the page
 * would wait for a landing that never comes; with it the page shows "not found".
 */
export const fetchPartnerLanding = async (slug?: string) => {
  const landing = await apiFetch<PartnerLanding | null>(
    getPartnerLandingEndpoint(slug),
  );
  if (!isPartnerLanding(landing)) {
    throw new Error('Not a partner landing');
  }
  return landing;
};

interface PartnerSessionDetails {
  ok: true;
  starts_at: string;
  ends_at: string;
  door_number: number;
}

/** Confirming a signup signs nobody in. It mails the access link and returns it to show. */
export interface PartnerVerifyResult extends PartnerSessionDetails {
  access_url: string;
}

/** The access link (magic link) signs the person in and names the page to join on. */
export interface PartnerAccessResult extends PartnerSessionDetails {
  personal_path: string;
}

export const registerPartner = (
  slug: string | undefined,
  body: { email: string; newsletter_subscribed: boolean },
) =>
  apiFetch<{ ok: true }>(
    getPartnerRegisterEndpoint(slug),
    {
      method: 'POST',
      useTagsOnly: true,
      body,
    },
  );

export const verifyPartnerEmail = (token: string) =>
  apiFetch<PartnerVerifyResult>(PARTNER_VERIFY_ENDPOINT, {
    method: 'POST',
    useTagsOnly: true,
    body: { token },
  });

export const openPartnerAccess = (token: string) =>
  apiFetch<PartnerAccessResult>(PARTNER_ACCESS_ENDPOINT, {
    method: 'POST',
    useTagsOnly: true,
    body: { token },
  });
