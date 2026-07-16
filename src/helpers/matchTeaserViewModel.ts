import type { MatchTeaserState } from './deriveMatchTeaserState';

export type MatchTeaserKind = MatchTeaserState['state'];
export type MatchTeaserVariant = 'success' | 'accent' | 'subtle';
export type MatchTeaserIcon = 'star' | 'message' | 'video' | 'clock' | 'heart';

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
  if (kind === 'cycle_complete') return 'success';
  if (kind === 'active') return 'subtle';
  return 'accent';
};

const getIcon = (kind: MatchTeaserKind): MatchTeaserIcon => {
  switch (kind) {
    case 'cycle_complete':
      return 'star';
    case 'no_message':
      return 'message';
    case 'no_call':
      return 'video';
    case 'gone_quiet':
      return 'clock';
    case 'active':
      return 'heart';
    default:
      return 'message';
  }
};

const getCopyKeys = (
  state: MatchTeaserState,
): Pick<MatchTeaserViewModel, 'titleKey' | 'sublineKey' | 'sublineParams'> => {
  const baseKey = `matchCard.teaser.${state.state}`;

  switch (state.state) {
    case 'cycle_complete':
      return {
        titleKey: `${baseKey}.title`,
        sublineKey: `${baseKey}.subline`,
        sublineParams: {
          calls: state.calls,
          months: state.months,
        },
      };
    case 'no_message':
    case 'gone_quiet':
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
    case 'active':
      return state.weekStreak >= 2
        ? {
            titleKey: `${baseKey}.title`,
            sublineKey: `${baseKey}.subline_with_streak`,
            sublineParams: {
              calls: state.calls,
              weeks: state.weekStreak,
            },
          }
        : {
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

export function mapMatchTeaserStateToViewModel(
  state: MatchTeaserState,
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
