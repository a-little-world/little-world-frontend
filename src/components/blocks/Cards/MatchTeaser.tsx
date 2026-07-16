import React from 'react';
import { useTranslation } from 'react-i18next';

import type { MatchTeaserViewModel } from '../../../helpers/matchTeaserViewModel';
import {
  TeaserChevron,
  TeaserIcon,
  TeaserIconWrap,
  TeaserLink,
  TeaserSubline,
  TeaserSummary,
  TeaserText,
  TeaserTitle,
} from './MatchTeaser.styles';

export type MatchTeaserProps = Pick<
  MatchTeaserViewModel,
  'variant' | 'icon' | 'titleKey' | 'sublineKey' | 'sublineParams'
> & {
  href?: string;
};

const MatchTeaser: React.FC<MatchTeaserProps> = ({
  variant,
  icon,
  titleKey,
  sublineKey,
  sublineParams,
  href,
}) => {
  const { t } = useTranslation();
  const title = t(titleKey);
  const subline = t(sublineKey, sublineParams);
  const ariaLabel = `${title}. ${subline}`;

  const content = (
    <>
      <TeaserIconWrap aria-hidden>
        <TeaserIcon icon={icon} label="" />
      </TeaserIconWrap>
      <TeaserText>
        <TeaserTitle>{title}</TeaserTitle>
        {subline && <TeaserSubline>{subline}</TeaserSubline>}
      </TeaserText>
      {href ? <TeaserChevron aria-hidden label="" /> : null}
    </>
  );

  if (!href) {
    return (
      <TeaserSummary $tint={variant} aria-label={ariaLabel}>
        {content}
      </TeaserSummary>
    );
  }

  return (
    <TeaserLink to={href} $tint={variant} aria-label={ariaLabel}>
      {content}
    </TeaserLink>
  );
};

export default MatchTeaser;
