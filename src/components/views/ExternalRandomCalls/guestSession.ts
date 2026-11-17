import { PARTNER_EVENT_TIME_ZONE } from '../PartnerLanding/constants';

export type RandomCallLobbyDetails = {
  uuid: string;
  name: string | null;
  status: boolean;
  start_time: string;
  end_time: string;
  active_users_count: number;
};

export type SignedInGuest = {
  email?: string;
  profile?: { first_name?: string | null };
};

export type ExternalGuestSession = {
  email: string;
  firstName: string | null;
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
  profileLine?: string;
  image?: string | null;
};

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
