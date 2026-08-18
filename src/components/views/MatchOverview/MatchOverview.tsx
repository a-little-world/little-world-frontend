import { useMemo, useState } from 'react';

import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  Link,
  ProgressRing,
  ProgressRingSizes,
  ProgressRingTones,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import type { ApiError } from '../../../api/types';
import { USER_TYPES } from '../../../constants';
import { useCallSetupStore } from '../../../features/stores/index';
import {
  getMatchOverviewEndpoint,
  USER_ENDPOINT,
} from '../../../features/swr/index';
import {
  activeWeekNumbers,
  deriveMatchState,
  toleratedWeekStreak,
} from '../../../helpers/deriveMatchState';
import {
  progressCopyKeys,
  progressCopyParams,
  progressCtaTarget,
  progressShowsLastCall,
} from '../../../helpers/deriveProgressCopy';
import { resolveOverviewBadges } from '../../../helpers/matchOverviewBadges';
import {
  deriveMatchOverviewStats,
  formatTotalHoursDisplay,
} from '../../../helpers/matchOverviewDerived';
import {
  getAppRoute,
  getAppSubpageRoute,
  HELP_CONTACT_ROUTE,
  MESSAGES_ROUTE,
} from '../../../router/routes';
import CallHistoryRow, { type CallDirection } from '../../atoms/CallHistoryRow';
import ProfileImage from '../../atoms/ProfileImage';
import SearchToggle from '../../atoms/SearchToggle';
import StatInline from '../../atoms/StatInline';
import StreakChip from '../../atoms/StreakChip';
import {
  AvatarPair,
  CallList,
  ContentRow,
  CtaBlock,
  CtaContext,
  HeaderBlock,
  HeaderIdentity,
  MatchSince,
  OverlapAvatar,
  OverviewCard,
  OverviewPage,
  PageTitle,
  PrimaryColumn,
  ProgressBody,
  ProgressCopy,
  ProgressHeading,
  ProgressHero,
  RingCaption,
  RingFraction,
  RingRest,
  RingValue,
  SearchToggleWrap,
  SecondaryColumn,
  Section,
  SectionHeading,
  ShowAllWrap,
  StatsStrip,
  TitleGroup,
} from './MatchOverview.styles';
import MatchOverviewBadges from './MatchOverviewBadges';

const VISIBLE_CALLS = 10;

type MatchOverviewSnapshot = {
  match_uuid: string;
  matched_at: string;
  as_of: string;
  current_week: number;
  active_weeks: number;
  cycle_weeks: number;
  is_free_play: boolean;
  calls: number;
  total_minutes: number;
  tokens: number;
  token_threshold: number;
  messages: number;
  streak_weeks: number;
  last_call_at: string | null;
};

type MatchOverviewCall = {
  uuid: string;
  started_at: string;
  duration_seconds: number;
  direction: CallDirection;
};

type OverviewPerson = {
  id: string;
  first_name: string;
  image: string | null;
  image_type: string;
  avatar_config: object | null;
  user_type: string;
};

type MatchOverviewResponse = {
  snapshot: MatchOverviewSnapshot;
  calls: MatchOverviewCall[];
  chat_id: string | null;
  partner: OverviewPerson;
  self: OverviewPerson;
};

/** Whole months since the match was made, for the completed-cycle copy. */
function monthsSince(iso: string): number {
  const from = new Date(iso);
  const now = new Date();
  const months =
    (now.getFullYear() - from.getFullYear()) * 12 +
    (now.getMonth() - from.getMonth());
  return Math.max(now.getDate() < from.getDate() ? months - 1 : months, 0);
}

function callDirection(value: string): CallDirection {
  if (value === 'incoming' || value === 'outgoing') return value;
  return 'unknown';
}

function MatchOverview() {
  const { t, i18n } = useTranslation();
  const { id: matchId = '' } = useParams();
  const callSetup = useCallSetupStore();
  const [showAllCalls, setShowAllCalls] = useState(false);

  const { data: user } = useSWR(USER_ENDPOINT);
  const { data: overview, error: overviewError } =
    useSWR<MatchOverviewResponse>(
      matchId ? getMatchOverviewEndpoint(matchId) : null,
      {
        shouldRetryOnError: (error: ApiError) => error.status !== 404,
      },
    );

  const snapshot = overview?.snapshot;
  const partner = overview?.partner;
  const selfProfile = overview?.self;
  const partnerUserId = partner?.id;

  const derived = useMemo(
    () =>
      snapshot
        ? deriveMatchOverviewStats({
            activeWeeks: snapshot.active_weeks,
            calls: snapshot.calls,
            totalMinutes: snapshot.total_minutes,
            streakWeeks: snapshot.streak_weeks,
            messages: snapshot.messages,
            cycleWeeks: snapshot.cycle_weeks,
          })
        : null,
    [snapshot],
  );

  // The streak the page speaks with: `x` of the last `x + 1` weeks had a call. Computed
  // from the call history the payload already carries rather than `snapshot.streak_weeks`,
  // which is a strict consecutive count and resets on a single missed week.
  const weekStreak = useMemo(() => {
    if (!snapshot || !overview) return 0;
    const matchedAt = new Date(snapshot.matched_at);
    return toleratedWeekStreak(
      activeWeekNumbers(
        matchedAt,
        overview.calls.map(call => new Date(call.started_at)),
      ),
      snapshot.current_week,
    );
  }, [overview, snapshot]);

  const badges = useMemo(
    () =>
      snapshot && overview
        ? resolveOverviewBadges(
            {
              calls: snapshot.calls,
              messages: snapshot.messages,
              callMinutes: snapshot.total_minutes,
              activeWeeks: snapshot.active_weeks,
            },
            {
              createdAt: snapshot.matched_at,
              calls: overview.calls.map(call => ({
                startedAt: call.started_at,
                durationSeconds: call.duration_seconds,
              })),
            },
          )
        : [],
    [overview, snapshot],
  );

  if (overviewError) {
    throw overviewError;
  }

  if (
    !partner ||
    !selfProfile ||
    !user?.profile ||
    !snapshot ||
    !derived ||
    !overview
  ) {
    return null;
  }

  const partnerName = partner.first_name;
  const startCall = () => {
    if (partnerUserId) {
      callSetup.initCallSetup({ userId: partnerUserId });
    }
  };

  const matchState = deriveMatchState({
    cycleComplete: derived.isCycleComplete,
    isActive: true,
    messageCount: snapshot.messages,
    callCount: snapshot.calls,
    monthsTogether: monthsSince(snapshot.matched_at),
    weekStreak,
    lastActivityAt: snapshot.last_call_at
      ? new Date(snapshot.last_call_at)
      : null,
  });
  const copyKeys = progressCopyKeys(matchState.state);
  const copyParams = progressCopyParams(matchState.state, {
    name: partnerName,
    weeksRemaining: derived.weeksRemaining,
    weekStreak,
  });
  const partnerChatTo = overview.chat_id
    ? getAppSubpageRoute(MESSAGES_ROUTE, overview.chat_id)
    : null;
  const ctaTo =
    progressCtaTarget(matchState.state) === 'support'
      ? getAppRoute(HELP_CONTACT_ROUTE)
      : partnerChatTo;
  const showLastCall = progressShowsLastCall(matchState.state);

  const lastCallWeekday = snapshot.last_call_at
    ? new Intl.DateTimeFormat(i18n.language, { weekday: 'long' }).format(
        new Date(snapshot.last_call_at),
      )
    : null;

  const visibleCalls = showAllCalls
    ? overview.calls
    : overview.calls.slice(0, VISIBLE_CALLS);

  const selfUsesAvatar = selfProfile.image_type === 'avatar';
  const partnerUsesAvatar = partner.image_type === 'avatar';

  return (
    <OverviewPage>
      <ContentRow>
        <PrimaryColumn>
          <OverviewCard>
            <HeaderBlock>
              <HeaderIdentity>
                <AvatarPair>
                  <OverlapAvatar>
                    <ProfileImage
                      circle
                      size="xsmall"
                      image={
                        selfUsesAvatar
                          ? selfProfile.avatar_config || {}
                          : selfProfile.image || ''
                      }
                      imageType={selfProfile.image_type}
                    />
                  </OverlapAvatar>
                  <OverlapAvatar>
                    <ProfileImage
                      circle
                      size="xsmall"
                      image={
                        partnerUsesAvatar
                          ? partner.avatar_config || {}
                          : partner.image || ''
                      }
                      imageType={partner.image_type}
                    />
                  </OverlapAvatar>
                </AvatarPair>
                <TitleGroup>
                  <PageTitle>
                    {t('match_overview.title', { name: partnerName })}
                  </PageTitle>
                  <MatchSince>
                    {t('match_overview.matched_since', {
                      date: new Intl.DateTimeFormat(i18n.language, {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      }).format(new Date(snapshot.matched_at)),
                    })}
                  </MatchSince>
                </TitleGroup>
              </HeaderIdentity>
              {snapshot.last_call_at && (
                <StreakChip
                  weeks={weekStreak}
                  state={weekStreak >= 1 ? 'active' : 'paused'}
                />
              )}
            </HeaderBlock>
            <StatsStrip aria-label={t('match_overview.stats_aria')}>
              <StatInline
                value={derived.calls}
                label={t('match_overview.stats.calls', {
                  count: derived.calls,
                })}
              />
              <StatInline
                value={formatTotalHoursDisplay(
                  derived.totalHours,
                  derived.totalMinutesRemainder,
                )}
                label={t('match_overview.stats.hours')}
              />
              {derived.avgMinutesPerCall !== null && (
                <StatInline
                  value={derived.avgMinutesPerCall}
                  label={t('match_overview.stats.avg_minutes', {
                    count: derived.avgMinutesPerCall,
                  })}
                />
              )}
              <StatInline
                value={derived.messages}
                label={t('match_overview.stats.messages', {
                  count: derived.messages,
                })}
              />
            </StatsStrip>
            <ProgressHero>
              <ProgressRing
                value={derived.ringValue}
                max={derived.ringMax}
                size={ProgressRingSizes.XLarge}
                tone={
                  derived.isCycleComplete
                    ? ProgressRingTones.Success
                    : ProgressRingTones.Accent
                }
                label={t('match_overview.ring_aria', {
                  value: derived.activeWeeks,
                  max: derived.ringMax,
                })}
              >
                {/* Own centre content: the DS label clamps to max, and a pair past
                      ten active weeks should still see the weeks they actually did. */}
                <RingFraction>
                  <RingValue type={TextTypes.Body2}>
                    {derived.activeWeeks}
                  </RingValue>
                  <RingRest type={TextTypes.Body4}>/</RingRest>
                  <RingRest type={TextTypes.Body4}>{derived.ringMax}</RingRest>
                </RingFraction>
                <RingCaption type={TextTypes.Body5}>
                  {t('match_overview.ring_caption')}
                </RingCaption>
              </ProgressRing>
              <ProgressCopy>
                <ProgressHeading type={TextTypes.Heading5} tag="h2">
                  {t(copyKeys.headingKey, copyParams)}
                </ProgressHeading>
                <ProgressBody type={TextTypes.Body4}>
                  {t(copyKeys.bodyKey, copyParams)}
                </ProgressBody>
                {matchState.state === 'successful' &&
                  user.profile.user_type === USER_TYPES.volunteer && (
                    <>
                      <ProgressBody type={TextTypes.Body4}>
                        {t(
                          'match_overview.progress.successful.volunteer_nudge',
                        )}
                      </ProgressBody>
                      <SearchToggleWrap>
                        <SearchToggle />
                      </SearchToggleWrap>
                    </>
                  )}
                {(copyKeys.ctaKey || (showLastCall && lastCallWeekday)) && (
                  <CtaBlock>
                    {copyKeys.ctaKey && ctaTo && (
                      <Link
                        buttonAppearance={ButtonAppearance.Primary}
                        buttonSize={ButtonSizes.Medium}
                        textDecoration={false}
                        to={ctaTo}
                        state={
                          progressCtaTarget(matchState.state) === 'support'
                            ? undefined
                            : { userPk: partnerUserId }
                        }
                      >
                        {t(copyKeys.ctaKey)}
                      </Link>
                    )}
                    {showLastCall && lastCallWeekday && (
                      <CtaContext type={TextTypes.Body6}>
                        {t('match_overview.last_call', {
                          weekday: lastCallWeekday,
                        })}
                      </CtaContext>
                    )}
                  </CtaBlock>
                )}
              </ProgressCopy>
            </ProgressHero>
          </OverviewCard>

          <MatchOverviewBadges badges={badges} onPlanCall={startCall} />
        </PrimaryColumn>
        {overview.calls.length > 0 && (
          <SecondaryColumn>
            <Section aria-labelledby="match-overview-calls">
              <SectionHeading id="match-overview-calls">
                {t('match_overview.calls_heading')}
              </SectionHeading>
              <CallList>
                {visibleCalls.map(call => (
                  <CallHistoryRow
                    key={call.uuid}
                    direction={callDirection(call.direction)}
                    startedAt={new Date(call.started_at)}
                    durationMinutes={Math.max(
                      0,
                      Math.round(call.duration_seconds / 60),
                    )}
                    showStatus={false}
                  />
                ))}
              </CallList>
              {!showAllCalls && overview.calls.length > VISIBLE_CALLS && (
                <ShowAllWrap>
                  <Button
                    appearance={ButtonAppearance.Secondary}
                    size={ButtonSizes.Medium}
                    type="button"
                    onClick={() => setShowAllCalls(true)}
                  >
                    {t('match_overview.show_all_calls', {
                      count: overview.calls.length,
                    })}
                  </Button>
                </ShowAllWrap>
              )}
            </Section>
          </SecondaryColumn>
        )}
      </ContentRow>
    </OverviewPage>
  );
}

export default MatchOverview;
