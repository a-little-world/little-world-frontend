import { useLayoutEffect, useMemo, useRef, useState } from 'react';

import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import {
  getNextInProgressBadge,
  orderAllBadges,
  orderBadgesForStrip,
  type ResolvedBadge,
} from '../../../helpers/matchOverviewBadges';
import BadgeMedal, { BadgeViewToggle } from '../../atoms/BadgeMedal';
import ScrollFade from '../../atoms/ScrollFade';
import NextBadgeNudge from '../../blocks/MatchOverview/NextBadgeNudge';
import {
  BADGE_WIDTH,
  BadgeItem,
  BadgeStrip,
  BadgeStripMeasure,
  OverviewCard,
  Section,
  SectionHeading,
} from './MatchOverview.styles';

/** Phone-width fallback so the first pass matches the strip comment (three medals). */
const COLLAPSED_SLOT_FALLBACK = 3;

function cssLengthToPx(length: string): number {
  const value = parseFloat(length);
  if (Number.isNaN(value)) return 0;
  if (length.trim().endsWith('rem')) {
    return (
      value * parseFloat(getComputedStyle(document.documentElement).fontSize)
    );
  }
  return value;
}

function badgeSlotsInWidth(
  width: number,
  columnWidth: number,
  gap: number,
): number {
  if (columnWidth <= 0) return 1;
  return Math.max(1, Math.floor((width + gap) / (columnWidth + gap)));
}

export interface MatchOverviewBadgesProps {
  badges: ResolvedBadge[];
  onPlanCall: () => void;
}

/**
 * The badges card: a strip of what is live now, expandable to the whole ladder.
 *
 * Collapsed shows earned badges plus the next rung of each category; expanded shows
 * everything, grouped completed → in progress → upcoming. How many collapsed medals
 * fit is a layout question — the last visible slot is the view-all control, so the
 * row does not grow. Expanded wraps and the control sits after the last badge.
 */
function MatchOverviewBadges({ badges, onPlanCall }: MatchOverviewBadgesProps) {
  const { t } = useTranslation();
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);
  const stripMeasureRef = useRef<HTMLDivElement>(null);
  const [slotCount, setSlotCount] = useState(COLLAPSED_SLOT_FALLBACK);

  const stripBadges = useMemo(() => orderBadgesForStrip(badges), [badges]);
  const allBadges = useMemo(() => orderAllBadges(badges), [badges]);
  const nextBadge = useMemo(() => getNextInProgressBadge(badges), [badges]);

  const collapsedCap = Math.max(slotCount - 1, 0);
  const collapsedVisibleBadges = stripBadges.slice(0, collapsedCap);
  const hiddenCount = Math.max(
    0,
    allBadges.length - collapsedVisibleBadges.length,
  );
  const showToggle = hiddenCount > 0 || expanded;

  useLayoutEffect(() => {
    const el = stripMeasureRef.current;
    if (!el) return () => {};

    const columnWidth = cssLengthToPx(BADGE_WIDTH);
    const gap = cssLengthToPx(theme.spacing.xxsmall);

    const update = () => {
      setSlotCount(badgeSlotsInWidth(el.clientWidth, columnWidth, gap));
    };

    const observer = new ResizeObserver(update);
    observer.observe(el);
    update();
    return () => {
      observer.disconnect();
    };
  }, [theme.spacing.xxsmall]);

  let visibleBadges = stripBadges;
  if (expanded) {
    visibleBadges = allBadges;
  } else if (showToggle) {
    visibleBadges = collapsedVisibleBadges;
  }

  return (
    <OverviewCard>
      <Section aria-labelledby="match-overview-badges">
        <SectionHeading id="match-overview-badges">
          {t('match_overview.badges_heading')}
        </SectionHeading>
        <BadgeStripMeasure ref={stripMeasureRef}>
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
              {showToggle && (
                <BadgeItem>
                  <BadgeViewToggle
                    expanded={expanded}
                    hiddenCount={hiddenCount}
                    onClick={() => setExpanded(!expanded)}
                  />
                </BadgeItem>
              )}
            </BadgeStrip>
          </ScrollFade>
        </BadgeStripMeasure>
        <NextBadgeNudge badge={nextBadge} onPlanCall={onPlanCall} />
      </Section>
    </OverviewCard>
  );
}

export default MatchOverviewBadges;
