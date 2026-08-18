import type { MatchState, MatchStateKind } from './deriveMatchState.ts';

export type MatchTeaserKind = MatchStateKind;
export type MatchTeaserVariant = 'success' | 'accent' | 'subtle';
export type MatchTeaserIcon =
  | 'star'
  | 'message'
  | 'video'
  | 'clock'
  | 'heart'
  | 'flame';

export interface MatchTeaserViewModel {
  kind: MatchTeaserKind;
  variant: MatchTeaserVariant;
  icon: MatchTeaserIcon;
  titleKey: string;
  sublineKey: string;
  sublineParams?: Record<string, string | number>;
  href: string;
}

const getVariant = (kind: MatchTeaserKind): MatchTeaserVariant => {
  if (kind === 'successful') return 'success';
  if (kind === 'engaged') return 'subtle';
  return 'accent';
};

const getIcon = (kind: MatchTeaserKind): MatchTeaserIcon => {
  switch (kind) {
    case 'successful':
      return 'star';
    case 'no_message':
      return 'message';
    case 'no_call':
      return 'video';
    case 'dormant':
      return 'clock';
    case 'streak_active':
      return 'flame';
    case 'engaged':
      return 'heart';
    default:
      return 'message';
  }
};

const getCopyKeys = (
  state: MatchState,
): Pick<MatchTeaserViewModel, 'titleKey' | 'sublineKey' | 'sublineParams'> => {
  const baseKey = `matchCard.teaser.${state.state}`;

  switch (state.state) {
    case 'successful':
      return {
        titleKey: `${baseKey}.title`,
        sublineKey: `${baseKey}.subline`,
        sublineParams: {
          calls: state.calls,
          months: state.months,
        },
      };
    case 'no_message':
    case 'dormant':
      return {
        titleKey: `${baseKey}.title`,
        sublineKey: `${baseKey}.subline`,
      };
    case 'no_call':
      return {
        titleKey: `${baseKey}.title`,
        sublineKey: `${baseKey}.subline`,
        sublineParams: {
          messages: state.messages,
        },
      };
    case 'streak_active':
      return {
        titleKey: `${baseKey}.title`,
        sublineKey: `${baseKey}.subline`,
        sublineParams: {
          calls: state.calls,
          weeks: state.weekStreak,
        },
      };
    case 'engaged':
      return {
        titleKey: `${baseKey}.title`,
        sublineKey: `${baseKey}.subline`,
        sublineParams: {
          calls: state.calls,
        },
      };
    default:
      return {
        titleKey: '',
        sublineKey: '',
      };
  }
};

export function mapMatchStateToTeaserViewModel(
  state: MatchState,
  href: string,
): MatchTeaserViewModel {
  const kind = state.state;

  return {
    kind,
    variant: getVariant(kind),
    icon: getIcon(kind),
    href,
    ...getCopyKeys(state),
  };
}

export function matchTeaserShowsDescription(
  kind: MatchTeaserKind | null,
): boolean {
  return !kind || kind === 'no_message';
}
