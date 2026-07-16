import {
  Button,
  ButtonAppearance,
  ButtonSizes,
} from '@a-little-world/little-world-design-system';
import { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';
import useSWR from 'swr';

import { useCallSetupStore } from '../../features/stores/index';
import { MATCHES_ENDPOINT, USER_ENDPOINT } from '../../features/swr/index';
import {
  getNextInProgressBadge,
  resolveBadgeStates,
} from '../../helpers/matchOverviewBadges';
import {
  deriveMatchOverviewStats,
  formatTotalHoursDisplay,
} from '../../helpers/matchOverviewDerived';
import BadgeMedal from '../atoms/BadgeMedal';
import CallHistoryRow from '../atoms/CallHistoryRow';
import ProfileImage from '../atoms/ProfileImage';
import ProgressRing from '../atoms/ProgressRing';
import StatInline from '../atoms/StatInline';
import { getMatchOverviewDummyData } from '../blocks/MatchOverview/matchOverviewDummyData';
import NextBadgeNudge from '../blocks/MatchOverview/NextBadgeNudge';
import {
  AvatarPair,
  BadgeGrid,
  BadgeItem,
  CallList,
  CtaBlock,
  CtaContext,
  HeaderBlock,
  MatchSince,
  OverlapAvatar,
  OverviewCard,
  OverviewPage,
  PageTitle,
  ProgressBody,
  ProgressCopy,
  ProgressHeading,
  ProgressHero,
  Section,
  SectionHeading,
  ShowAllWrap,
  StatsStrip,
  TitleGroup,
} from './MatchOverview.styles';

const VISIBLE_CALLS = 4;

function MatchOverview() {
  const { t, i18n } = useTranslation();
  const { id: matchId = '' } = useParams();
  const callSetup = useCallSetupStore();
  const [showAllCalls, setShowAllCalls] = useState(false);

  const { data: matches } = useSWR(MATCHES_ENDPOINT);
  const { data: user } = useSWR(USER_ENDPOINT);

  const match = useMemo(() => {
    if (!matches || !matchId) return undefined;
    return [...matches.support.results, ...matches.confirmed.results].find(
      ({ id }) => String(id) === String(matchId),
    );
  }, [matches, matchId]);

  const partnerUserId = match?.partner?.id;

  const payload = useMemo(() => {
    if (!match?.partner || !user?.profile) return null;
    return getMatchOverviewDummyData(
      {
        first_name: match.partner.first_name,
        image: match.partner.image,
        image_type: match.partner.image_type,
        avatar_config: match.partner.avatar_config,
      },
      {
        first_name: user.profile.first_name,
        image: user.profile.image,
        image_type: user.profile.image_type,
        avatar_config: user.profile.avatar_config,
      },
    );
  }, [match, user]);

  const derived = useMemo(
    () =>
      payload
        ? deriveMatchOverviewStats({
            week: payload.week,
            calls: payload.calls,
            totalMinutes: payload.totalMinutes,
            streakWeeks: payload.streakWeeks,
            messages: payload.messages,
          })
        : null,
    [payload],
  );

  const badges = useMemo(
    () =>
      payload
        ? resolveBadgeStates(payload.badges, {
            calls: payload.calls,
            week: payload.week,
            messages: payload.messages,
          })
        : [],
    [payload],
  );

  const nextBadge = useMemo(() => getNextInProgressBadge(badges), [badges]);

  if (!match || !payload || !derived) {
    return null;
  }

  const partnerName = payload.partner.first_name;
  const startCall = () => {
    if (partnerUserId) {
      callSetup.initCallSetup({ userId: partnerUserId });
    }
  };

  const lastCallWeekday = payload.lastCallAt
    ? new Intl.DateTimeFormat(i18n.language, { weekday: 'long' }).format(
        new Date(payload.lastCallAt),
      )
    : null;

  const visibleCalls = showAllCalls
    ? payload.callHistory
    : payload.callHistory.slice(0, VISIBLE_CALLS);

  const selfUsesAvatar = payload.self.image_type === 'avatar';
  const partnerUsesAvatar = payload.partner.image_type === 'avatar';

  return (
    <>
      {/* <PageHeader
        canGoBack
        text={t('match_overview.page_header', { name: partnerName })}
      /> */}
      <OverviewPage>
        <OverviewCard>
          <HeaderBlock>
            <AvatarPair>
              <OverlapAvatar>
                <ProfileImage
                  circle
                  size="xsmall"
                  image={
                    selfUsesAvatar && payload.self.avatar_config
                      ? payload.self.avatar_config
                      : payload.self.image
                  }
                  imageType={payload.self.image_type}
                />
              </OverlapAvatar>
              <OverlapAvatar>
                <ProfileImage
                  circle
                  size="xsmall"
                  image={
                    partnerUsesAvatar && payload.partner.avatar_config
                      ? payload.partner.avatar_config
                      : payload.partner.image
                  }
                  imageType={payload.partner.image_type}
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
                  }).format(new Date(payload.matchedAt)),
                })}
              </MatchSince>
            </TitleGroup>
          </HeaderBlock>

          <ProgressHero>
            <ProgressRing
              value={derived.ringValue}
              max={derived.ringMax}
              size="hero"
              tone={derived.isFreePlay ? 'success' : 'accent'}
              caption={t('match_overview.ring_caption')}
              label={t('match_overview.ring_aria', {
                value: derived.ringValue,
                max: derived.ringMax,
              })}
            />
            <ProgressCopy>
              <ProgressHeading>
                {derived.isFreePlay
                  ? t('match_overview.free_play_heading')
                  : t('match_overview.weeks_remaining_heading', {
                      count: derived.weeksRemaining,
                    })}
              </ProgressHeading>
              <ProgressBody>
                {derived.isFreePlay
                  ? t('match_overview.free_play_body')
                  : t('match_overview.cycle_body')}
              </ProgressBody>
              <CtaBlock>
                <Button
                  appearance={ButtonAppearance.Primary}
                  size={ButtonSizes.Medium}
                  type="button"
                  onClick={startCall}
                >
                  {t('match_overview.start_call')}
                </Button>
                {lastCallWeekday && (
                  <CtaContext>
                    {t('match_overview.last_call', {
                      weekday: lastCallWeekday,
                    })}
                  </CtaContext>
                )}
              </CtaBlock>
            </ProgressCopy>
          </ProgressHero>

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
              value={derived.streakWeeks}
              label={t('match_overview.stats.streak', {
                count: derived.streakWeeks,
              })}
            />
            <StatInline
              value={derived.messages}
              label={t('match_overview.stats.messages', {
                count: derived.messages,
              })}
            />
          </StatsStrip>

          <Section aria-labelledby="match-overview-badges">
            <SectionHeading id="match-overview-badges">
              {t('match_overview.badges_heading')}
            </SectionHeading>
            <BadgeGrid>
              {badges.map(badge => (
                <BadgeItem key={badge.id}>
                  <BadgeMedal badge={badge} />
                </BadgeItem>
              ))}
            </BadgeGrid>
            <NextBadgeNudge badge={nextBadge} onPlanCall={startCall} />
          </Section>

          <Section aria-labelledby="match-overview-calls">
            <SectionHeading id="match-overview-calls">
              {t('match_overview.calls_heading')}
            </SectionHeading>
            <CallList>
              {visibleCalls.map(call => (
                <CallHistoryRow
                  key={call.id}
                  direction={call.direction}
                  startedAt={new Date(call.startedAt)}
                  durationMinutes={call.durationMinutes}
                  bothParticipated={call.bothParticipated}
                  showStatus={false}
                />
              ))}
            </CallList>
            {!showAllCalls && payload.callHistory.length > VISIBLE_CALLS && (
              <ShowAllWrap>
                <Button
                  appearance={ButtonAppearance.Secondary}
                  size={ButtonSizes.Medium}
                  type="button"
                  onClick={() => setShowAllCalls(true)}
                >
                  {t('match_overview.show_all_calls', {
                    count: payload.callHistory.length,
                  })}
                </Button>
              </ShowAllWrap>
            )}
          </Section>
        </OverviewCard>
      </OverviewPage>
    </>
  );
}

export default MatchOverview;
