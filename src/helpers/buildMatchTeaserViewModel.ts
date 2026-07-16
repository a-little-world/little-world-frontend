import {
  MESSAGES_ROUTE,
  getAppSubpageRoute,
  getCallSetupRoute,
  getMatchOverviewRoute,
} from '../router/routes';
import {
  mapMatchTeaserStateToViewModel,
  type MatchTeaserKind,
  type MatchTeaserViewModel,
} from './matchTeaserViewModel';
import {
  deriveMatchTeaserState,
  type MatchTeaserInput,
} from './deriveMatchTeaserState';

export type {
  MatchTeaserIcon,
  MatchTeaserKind,
  MatchTeaserVariant,
  MatchTeaserViewModel,
} from './matchTeaserViewModel';
export { matchTeaserShowsDescription } from './matchTeaserViewModel';

export interface MatchTeaserContext {
  chatId: string;
  userPk: string;
  matchId: string;
}

const getHref = (kind: MatchTeaserKind, context: MatchTeaserContext): string => {
  switch (kind) {
    case 'cycle_complete':
    case 'active':
      return getMatchOverviewRoute(context.matchId);
    case 'no_message':
    case 'gone_quiet':
      return getAppSubpageRoute(MESSAGES_ROUTE, context.chatId);
    case 'no_call':
      return getCallSetupRoute(context.userPk);
    default:
      return getAppSubpageRoute(MESSAGES_ROUTE, context.chatId);
  }
};

export function buildMatchTeaserViewModel(
  input: MatchTeaserInput,
  context: MatchTeaserContext,
  now: Date = new Date(),
): MatchTeaserViewModel {
  const state = deriveMatchTeaserState(input, now);

  return mapMatchTeaserStateToViewModel(state, getHref(state.state, context));
}
