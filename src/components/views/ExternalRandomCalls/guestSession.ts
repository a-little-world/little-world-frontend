import { PARTNER_EVENT_TIME_ZONE } from '../PartnerLanding/constants';

export type RandomCallLobbyDetails = {
  uuid: string;
  name: string | null;
  status: boolean;
  start_time: string;
  end_time: string;
  active_users_count: number;
};

export const DESIGN_PREVIEW_LOBBY = 'preview';

export const isDesignPreview = (lobbyId?: string) =>
  lobbyId === DESIGN_PREVIEW_LOBBY;

export const previewCallCount = (search: string) => {
  const value = new URLSearchParams(search).get('calls');
  if (value === '0') return 0;
  if (value === '3') return 3;
  return 1;
};

export const previewWindowClosed = (search: string) =>
  new URLSearchParams(search).get('window') === 'closed';

const hour = 60 * 60 * 1000;

export const previewLobby = (closed: boolean): RandomCallLobbyDetails => {
  const now = Date.now();
  return {
    uuid: DESIGN_PREVIEW_LOBBY,
    name: 'capgemini',
    status: !closed,
    start_time: new Date(
      closed ? now - 2 * hour : now - 30 * 60 * 1000,
    ).toISOString(),
    end_time: new Date(
      closed ? now - hour : now + 30 * 60 * 1000,
    ).toISOString(),
    active_users_count: 4,
  };
};

export const PREVIEW_FIRST_NAME = 'Anna';

export type SignedInGuest = {
  email?: string;
  /** Set by the guest-account work. Absent until that lands, so a real account is not temporary. */
  isTemporary?: boolean;
  profile?: { first_name?: string | null };
};

/** Anyone without a full account: not signed in, or on a temporary guest account. */
export const isGuestUser = (user?: SignedInGuest | null) =>
  !user || user.isTemporary === true;

export type ExternalGuestSession = {
  email: string;
  firstName: string | null;
  isGuest: boolean;
  partnerName: string | null;
  startsAt: Date;
  endsAt: Date;
  timeZone: string;
  lobbyUuid: string;
  activeUsersCount: number;
};

export const sessionFromLobby = (
  lobby: RandomCallLobbyDetails,
  user?: SignedInGuest | null,
  partnerName?: string | null,
): ExternalGuestSession => ({
  email: user?.email ?? '',
  firstName: user?.profile?.first_name?.trim() || null,
  isGuest: isGuestUser(user),
  partnerName: partnerName?.trim() || null,
  startsAt: new Date(lobby.start_time),
  endsAt: new Date(lobby.end_time),
  timeZone: PARTNER_EVENT_TIME_ZONE,
  lobbyUuid: String(lobby.uuid),
  activeUsersCount: lobby.active_users_count ?? 0,
});

const nameKey = (lobbyId?: string) =>
  `external-random-call-first-name:${lobbyId || 'preview'}`;

export const readGuestFirstName = (lobbyId?: string): string => {
  if (typeof sessionStorage === 'undefined') return '';
  try {
    return sessionStorage.getItem(nameKey(lobbyId))?.trim() ?? '';
  } catch {
    return '';
  }
};

export const saveGuestFirstName = (
  lobbyId: string | undefined,
  name: string,
) => {
  try {
    sessionStorage.setItem(nameKey(lobbyId), name);
  } catch {
    // Storage can be blocked; the name still lives in component state.
  }
};

export const lobbyIsActive = (startsAt: Date, endsAt: Date, now = new Date()) =>
  now.getTime() >= startsAt.getTime() && now.getTime() <= endsAt.getTime();

export type GuestCallSummary = {
  id?: string;
  partnerName: string;
  partnerId: string | null;
  durationMinutes: number;
  image?: string | null;
};

const SAMPLE_CALLS: GuestCallSummary[] = [
  {
    id: 'preview-henry',
    partnerName: 'Henry',
    partnerId: 'henry',
    durationMinutes: 28,
    image: null,
  },
  {
    id: 'preview-meryem',
    partnerName: 'Meryem',
    partnerId: 'meryem',
    durationMinutes: 12,
    image: null,
  },
  {
    id: 'preview-tomasz',
    partnerName: 'Tomasz',
    partnerId: 'tomasz',
    durationMinutes: 12,
    image: null,
  },
];

export const previewCalls = (count: number) => SAMPLE_CALLS.slice(0, count);

const summaryKey = (lobbyId: string) =>
  `external-random-call-summary:${lobbyId}`;
const callsKey = (lobbyId: string) => `external-random-call-calls:${lobbyId}`;

const isCallSummary = (value: unknown): value is GuestCallSummary => {
  if (!value || typeof value !== 'object') return false;
  const summary = value as GuestCallSummary;
  return typeof summary.durationMinutes === 'number';
};

export const readGuestCalls = (lobbyId?: string): GuestCallSummary[] => {
  if (!lobbyId || typeof sessionStorage === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(callsKey(lobbyId));
    if (raw) {
      const parsed = JSON.parse(raw) as unknown;
      if (Array.isArray(parsed)) {
        return parsed.filter(isCallSummary).map((call, index) => ({
          ...call,
          id: call.id ?? `saved-${index}`,
        }));
      }
    }
    const last = readGuestCallSummary(lobbyId);
    return last ? [{ ...last, id: last.id ?? 'saved-0' }] : [];
  } catch {
    return [];
  }
};

export const saveGuestCallSummary = (
  lobbyId: string,
  summary: GuestCallSummary,
) => {
  try {
    const calls = readGuestCalls(lobbyId);
    calls.push({
      ...summary,
      id: summary.id ?? `${Date.now()}-${calls.length}`,
    });
    sessionStorage.setItem(callsKey(lobbyId), JSON.stringify(calls));
    sessionStorage.setItem(summaryKey(lobbyId), JSON.stringify(summary));
  } catch {
    // The after-call page still renders without the summary.
  }
};

export const readGuestCallSummary = (
  lobbyId?: string,
): GuestCallSummary | null => {
  if (!lobbyId || typeof sessionStorage === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(summaryKey(lobbyId));
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    return isCallSummary(parsed) ? parsed : null;
  } catch {
    return null;
  }
};
