import {
  getAppSubpageRoute,
  getCallSetupRoute,
  getMatchOverviewRoute,
  MESSAGES_ROUTE,
} from '../router/routes';
import { deriveMatchState, type MatchStateInput } from './deriveMatchState.ts';
import {
  mapMatchStateToTeaserViewModel,
  type MatchTeaserKind,
  type MatchTeaserViewModel,
} from './matchTeaserViewModel.ts';

export type {
  MatchTeaserIcon,
  MatchTeaserKind,
  MatchTeaserVariant,
  MatchTeaserViewModel,
} from './matchTeaserViewModel.ts';
export { matchTeaserShowsDescription } from './matchTeaserViewModel.ts';

export interface MatchTeaserContext {
  chatId: string;
  userPk: string;
  matchId: string;
}

const getHref = (
  kind: MatchTeaserKind,
  context: MatchTeaserContext,
): string => {
  switch (kind) {
    case 'successful':
    case 'streak_active':
    case 'engaged':
      return getMatchOverviewRoute(context.matchId);
    case 'no_message':
    case 'dormant':
      return getAppSubpageRoute(MESSAGES_ROUTE, context.chatId);
    case 'no_call':
      return getCallSetupRoute(context.userPk);
    default:
      return getAppSubpageRoute(MESSAGES_ROUTE, context.chatId);
  }
};

export function buildMatchTeaserViewModel(
  input: MatchStateInput,
  context: MatchTeaserContext,
  now: Date = new Date(),
): MatchTeaserViewModel {
  const state = deriveMatchState(input, now);

  return mapMatchStateToTeaserViewModel(state, getHref(state.state, context));
}
