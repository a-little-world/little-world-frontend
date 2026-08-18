import { useMemo, useState } from 'react';

import { useTranslation } from 'react-i18next';

import {
  getNextInProgressBadge,
  orderAllBadges,
  orderBadgesForStrip,
  type ResolvedBadge,
} from '../../../helpers/matchOverviewBadges';
import BadgeMedal from '../../atoms/BadgeMedal';
import ScrollFade from '../../atoms/ScrollFade';
import NextBadgeNudge from '../../blocks/MatchOverview/NextBadgeNudge';
import {
  BadgeActions,
  BadgeItem,
  BadgeStrip,
  LinkButton,
  OverviewCard,
  Section,
  SectionHeading,
} from './MatchOverview.styles';

export interface MatchOverviewBadgesProps {
  badges: ResolvedBadge[];
  onPlanCall: () => void;
}

/**
 * The badges card: a strip of what is live now, expandable to the whole ladder.
 *
 * Collapsed shows earned badges plus the next rung of each category; expanded shows
 * everything, grouped completed → in progress → upcoming. Neither view caps how many
 * are drawn — the strip scrolls and the expanded grid wraps, so the layout decides how
 * many fit (see `BADGE_MIN_WIDTH`).
 */
function MatchOverviewBadges({ badges, onPlanCall }: MatchOverviewBadgesProps) {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);

  const stripBadges = useMemo(() => orderBadgesForStrip(badges), [badges]);
  const allBadges = useMemo(() => orderAllBadges(badges), [badges]);
  const nextBadge = useMemo(() => getNextInProgressBadge(badges), [badges]);

  const visibleBadges = expanded ? allBadges : stripBadges;
  const canExpand = stripBadges.length < allBadges.length;

  return (
    <OverviewCard>
      <Section aria-labelledby="match-overview-badges">
        <SectionHeading id="match-overview-badges">
          {t('match_overview.badges_heading')}
        </SectionHeading>
        <ScrollFade resetKey={expanded ? 'all' : 'strip'}>
          <BadgeStrip
            aria-label={t('match_overview.badges_heading')}
            $expanded={expanded}
          >
            {visibleBadges.map(badge => (
              <BadgeItem key={badge.id}>
                <BadgeMedal badge={badge} />
              </BadgeItem>
            ))}
          </BadgeStrip>
        </ScrollFade>
        {(canExpand || expanded) && (
          <BadgeActions>
            <LinkButton type="button" onClick={() => setExpanded(!expanded)}>
              {t(
                expanded
                  ? 'match_overview.show_less_badges'
                  : 'match_overview.show_all_badges',
              )}
            </LinkButton>
          </BadgeActions>
        )}
        <NextBadgeNudge badge={nextBadge} onPlanCall={onPlanCall} />
      </Section>
    </OverviewCard>
  );
}

export default MatchOverviewBadges;
