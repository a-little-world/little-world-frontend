import {
  Accordion,
  AccordionContent,
  Button,
  Card,
  CardContent,
  CardHeader,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import heroDesktop from '../../../images/partner-landing/hero-desktop.webp';
import heroMobile from '../../../images/partner-landing/hero-mobile.webp';
import lightsBackground from '../../../images/partner-landing/lights.webp';
import Logo from '../../atoms/Logo';
import { softAvatarShadowValue, softCardShadowValue } from './shadow';

export const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
`;

export const pageSidePadding = css`
  padding-left: ${({ theme }) => theme.spacing.medium};
  padding-right: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding-left: ${theme.spacing.xxxlarge};
      padding-right: ${theme.spacing.xxxlarge};
    }

    @media (min-width: ${theme.breakpoints.large}) {
      padding-left: ${theme.spacing.massive};
      padding-right: ${theme.spacing.massive};
    }
  `}
`;

const sectionPadding = css`
  padding-top: ${({ theme }) => theme.spacing.xlarge};
  padding-bottom: ${({ theme }) => theme.spacing.xxlarge};
  ${pageSidePadding}

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding-top: ${theme.spacing.xxxxlarge};
      padding-bottom: ${theme.spacing.xxxxlarge};
    }
  `}
`;

export const Section = styled.section<{
  $tone?: 'primary' | 'secondary' | 'subtle';
}>`
  ${sectionPadding}
  background: ${({ theme, $tone }) => {
    if ($tone === 'secondary') return theme.color.surface.secondary;
    if ($tone === 'subtle') return theme.color.surface.subtle;
    return theme.color.surface.primary;
  }};
  color: ${({ theme }) => theme.color.text.primary};
`;

export const SectionInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.xxlarge};
  margin: 0 auto;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.xlarge};
    }
  `}
`;

export const SectionIntro = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  max-width: 48rem;
`;

export const SectionEyebrow = styled(Text).attrs({
  type: TextTypes.Body6,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.title};
  text-transform: uppercase;
  margin: 0;
`;

export const SectionTitle = styled(Text).attrs({
  type: TextTypes.Heading3,
  tag: 'h2' as const,
})`
  color: ${({ theme }) => theme.color.text.heading};
  margin: 0;
  text-wrap: balance;
  overflow-wrap: break-word;
`;

export const Hero = styled.section`
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-height: 100vh;
  min-height: 100dvh;
  color: ${({ theme }) => theme.color.text.button};
  background: ${({ theme }) => theme.color.text.info};

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: url(${heroMobile}) center bottom / cover no-repeat;

    ${({ theme }) => css`
      @media (min-width: ${theme.breakpoints.medium}) {
        background-image: url(${heroDesktop});
        background-position: right center;
        background-size: cover;
      }
    `}
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      180deg,
      color-mix(
          in srgb,
          ${({ theme }) => theme.color.text.info} 62%,
          transparent
        )
        0%,
      color-mix(
          in srgb,
          ${({ theme }) => theme.color.text.info} 28%,
          transparent
        )
        48%,
      color-mix(
          in srgb,
          ${({ theme }) => theme.color.text.info} 10%,
          transparent
        )
        100%
    );

    ${({ theme }) => css`
      @media (min-width: ${theme.breakpoints.medium}) {
        background: linear-gradient(
          90deg,
          color-mix(in srgb, ${theme.color.text.info} 68%, transparent) 0%,
          color-mix(in srgb, ${theme.color.text.info} 32%, transparent) 36%,
          color-mix(in srgb, ${theme.color.text.info} 8%, transparent) 58%,
          transparent 78%
        );
      }
    `}
  }
`;

export const NavBar = styled.nav`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  height: ${({ theme }) =>
    `calc(${theme.spacing.xxxxlarge} - ${theme.spacing.xlarge})`};
  padding-top: 0;
  padding-bottom: 0;
  margin-top: ${({ theme }) => theme.spacing.xxxsmall};
  ${pageSidePadding}

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      height: ${theme.spacing.xxxlarge};
      margin-top: 0;
    }
  `}
`;

export const HomeLink = styled.a`
  display: flex;
  align-items: center;
  min-width: fit-content;
  text-decoration: none;
  color: inherit;
`;

export const WhiteLogo = styled(Logo)`
  filter: brightness(0) invert(1);
`;

export const PartnerPill = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  padding: ${({ theme }) =>
    `calc(${theme.spacing.xxxsmall} + ${theme.spacing.xxxxsmall} / 2) ${theme.spacing.xsmall}`};
  border-radius: ${({ theme }) => theme.radius.massive};
  background: ${({ theme }) => theme.color.surface.primary};
  box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
    rgb(255 255 255 / 85%);

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xxxsmall} ${theme.spacing.small};
    }
  `}
`;

export const PartnerLogo = styled.img`
  display: block;
  height: ${({ theme }) => theme.spacing.medium};
  width: auto;
  max-width: ${({ theme }) => theme.spacing.xxxlarge};
  object-fit: contain;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      max-width: ${theme.spacing.xxxxlarge};
    }
  `}
`;

export const PartnerCoopLabel = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
  bold: true,
})`
  display: none;
  color: ${({ theme }) => theme.color.text.info};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: inline;
    }
  `}
`;

export const PartnerName = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.heading};
  text-transform: uppercase;
`;

export const Garland = styled.div`
  position: absolute;
  top: -12px;
  width: 100%;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.spacing.large};
  padding-top: 0;
  padding-bottom: 0;
  ${pageSidePadding}
  pointer-events: none;

  > :nth-child(n + 13) {
    display: none;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      top: 0;

      > :nth-child(n + 13) {
        display: block;
      }
    }
  `}
`;

export const GarlandLight = styled.span<{
  $tone: 'highlight' | 'accent' | 'heading' | 'title';
  $wave: number;
}>`
  width: ${({ theme }) => theme.spacing.xxsmall};
  height: ${({ theme }) => theme.spacing.xxsmall};
  border-radius: ${({ theme }) => theme.radius.half};
  transform: translateY(
    calc(${({ theme }) => theme.spacing.xsmall} * ${({ $wave }) => $wave})
  );
  background: ${({ theme, $tone }) => {
    if ($tone === 'highlight') return theme.color.surface.highlight;
    if ($tone === 'accent') return theme.color.surface.bold;
    if ($tone === 'heading') return theme.color.text.heading;
    return theme.color.text.title;
  }};
  box-shadow: 0 0 ${({ theme }) => theme.spacing.xxsmall}
    ${({ theme }) => theme.spacing.xxxxsmall} currentColor;
  color: ${({ theme, $tone }) => {
    if ($tone === 'highlight') return theme.color.surface.highlight;
    if ($tone === 'accent') return theme.color.surface.bold;
    if ($tone === 'heading') return theme.color.text.heading;
    return theme.color.text.title;
  }};

  @media (prefers-reduced-motion: reduce) {
    transform: none;
    box-shadow: none;
  }
`;

export const HeroLayout = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`};
  width: 100%;
  padding-top: ${({ theme }) => theme.spacing.large};
  padding-bottom: ${({ theme }) => theme.spacing.xxlarge};
  ${pageSidePadding}

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const HeroContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: 50rem;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      justify-content: center;
    }
  `}
`;

export const HeroBadge = styled.div`
  position: absolute;
  left: ${({ theme }) =>
    `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};
  bottom: ${({ theme }) =>
    `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  max-width: calc(100% - ${({ theme }) => theme.spacing.large});
  padding: ${({ theme }) =>
    `${`calc(${theme.spacing.xxsmall} + ${theme.spacing.xxxxsmall})`} ${theme.spacing.small} ${`calc(${theme.spacing.xxsmall} + ${theme.spacing.xxxxsmall})`} ${`calc(${theme.spacing.xxsmall} + ${theme.spacing.xxxxsmall})`}`};
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.medium};
  box-shadow: 0 ${({ theme }) => theme.spacing.xxsmall}
    ${({ theme }) => theme.spacing.medium} rgb(5 40 80 / 30%);
`;

export const HeroDoor = styled.div`
  position: relative;
  flex-shrink: 0;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  width: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xxxsmall})`};
  height: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xxxsmall})`};
  padding-top: ${({ theme }) => theme.spacing.xxxxsmall};
  background: ${({ theme }) => theme.color.gradient.blue10};
  border-radius: ${({ theme }) =>
    `${theme.radius.massive} ${theme.radius.massive} ${theme.radius.xxxsmall} ${theme.radius.xxxsmall}`};
  box-shadow:
    inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.surface.primary},
    0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.border.bold};
`;

export const HeroDoorNumber = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.button};
  line-height: 1;
`;

export const HeroBadgeCopy = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const HeroBadgeTitle = styled(Text).attrs({
  type: TextTypes.Body6,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  margin: 0;
`;

export const HeroBadgeText = styled(Text).attrs({
  type: TextTypes.Body6,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.info};
  margin: 0;
`;

export const HeroPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const EyebrowPill = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
  bold: true,
})`
  align-self: flex-start;
  color: ${({ theme }) => theme.color.text.button};
  background: color-mix(
    in srgb,
    ${({ theme }) => theme.color.text.info} 55%,
    transparent
  );
  border: 2px solid ${({ theme }) => theme.color.border.info};
  border-radius: ${({ theme }) => theme.radius.massive};
  padding: ${({ theme }) => `${theme.spacing.xxxsmall} ${theme.spacing.small}`};
`;

export const PartnerDoorPill = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.title};
  background: ${({ theme }) => theme.color.surface.primary};
  border: 2px solid ${({ theme }) => theme.color.border.highlight};
  border-radius: ${({ theme }) => theme.radius.massive};
  padding: ${({ theme }) => `${theme.spacing.xxxsmall} ${theme.spacing.small}`};
`;

export const HeroTitle = styled(Text).attrs({
  type: TextTypes.Heading3,
  tag: 'h1' as const,
})`
  color: ${({ theme }) => theme.color.text.button};
  line-height: 1.05;
  text-wrap: balance;
  overflow-wrap: break-word;
  margin: 0;
`;

export const HeroLead = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.button};
  line-height: 1.5;
  text-shadow: 0 1px 8px rgb(0 0 0 / 50%);
  margin: 0;
  overflow-wrap: break-word;
`;

export const FinalBlock = styled.section`
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};
  padding-top: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xxsmall})`};
  padding-bottom: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xxsmall})`};
  ${pageSidePadding}
  color: ${({ theme }) => theme.color.text.button};
  background: ${({ theme }) => theme.color.text.info};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding-top: ${theme.spacing.xxxxlarge};
      padding-bottom: ${theme.spacing.xxxxlarge};
      gap: ${theme.spacing.medium};
    }
  `}

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: url(${lightsBackground}) center / cover no-repeat;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    z-index: 0;
    background: linear-gradient(
      180deg,
      color-mix(
          in srgb,
          ${({ theme }) => theme.color.text.info} 36%,
          transparent
        )
        0%,
      color-mix(
          in srgb,
          ${({ theme }) => theme.color.text.info} 18%,
          transparent
        )
        100%
    );
  }
`;

export const FinalInner = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};
  width: 100%;
  max-width: 100%;

  > * {
    width: 100%;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
      max-width: 40rem;
    }
  `}
`;

export const FinalTitle = styled(Text).attrs({
  type: TextTypes.Heading3,
  tag: 'h2' as const,
})`
  color: ${({ theme }) => theme.color.text.button};
  line-height: 1.05;
  overflow-wrap: break-word;
  margin: 0;
`;

export const FinalLead = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.button};
  line-height: 1.5;
  max-width: 38.75rem;
  margin: 0;
  overflow-wrap: break-word;
`;

export const StickyBar = styled.div<{ $visible: boolean }>`
  display: ${({ $visible }) => ($visible ? 'block' : 'none')};
  position: fixed;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  right: ${({ theme }) => theme.spacing.small};
  bottom: ${({ theme }) => theme.spacing.small};
  left: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (max-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small};
      padding-bottom: max(${theme.spacing.small}, env(safe-area-inset-bottom));
      margin: 0;
      right: 0;
      bottom: 0;
      left: 0;
      background: ${theme.color.surface.primary};
      box-shadow: 0 -${theme.spacing.xxxxsmall} ${theme.spacing.small}
        rgb(0 0 0 / 8%);
    }

    @media (min-width: ${theme.breakpoints.medium}) {
      right: ${theme.spacing.large};
      bottom: ${theme.spacing.large};
      left: auto;
    }
  `}
`;

export const StickyButton = styled(Button)`
  && {
    width: 100%;
    max-width: 100%;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        width: auto;
      }
    }
  `}
`;

export const StatusWrap = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.medium};
  min-height: 100vh;
  padding: ${({ theme }) => theme.spacing.large};
  background: ${({ theme }) => theme.color.surface.primary};
`;

export const CardGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      grid-template-columns: repeat(4, 1fr);
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const FeatureCard = styled(Card)`
  && {
    flex-direction: row;
    align-items: flex-start;
    gap: ${({ theme }) =>
      `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};
    padding: ${({ theme }) =>
      `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};
    border-radius: ${({ theme }) => theme.radius.xlarge};
    border: none;
    box-shadow:
      inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
        ${({ theme }) => theme.color.border.subtle},
      ${softCardShadowValue};
    background: ${({ theme }) => theme.color.surface.primary};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      && {
        flex-direction: column;
        gap: ${theme.spacing.small};
        padding: ${theme.spacing.medium};
      }
    }
  `}
`;

export const FeatureCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  min-width: 0;
`;

export const IconCircle = styled.div<{ $tone?: 'accent' | 'success' }>`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
  height: ${({ theme }) =>
    `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme, $tone }) =>
    $tone === 'success'
      ? theme.color.surface.success
      : theme.color.surface.accent};
`;

export const FeatureTitle = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'h3' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
  overflow-wrap: break-word;
  margin: 0;
`;

export const FeatureText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  line-height: 1.5;
  margin: 0;
`;

export const SplitSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      align-items: stretch;
      gap: ${theme.spacing.xxlarge};
    }
  `}
`;

export const SplitColumn = styled.div<{ $singleQuote?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.small} + ${theme.spacing.xxxxsmall})`};
  min-width: 0;

  ${({ theme, $singleQuote }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex: 1;
      gap: ${theme.spacing.medium};
      padding-top: ${$singleQuote ? theme.spacing.large : '0'};
    }
  `}
`;

export const BenefitList = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.small} + ${theme.spacing.xxxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const BenefitRow = styled.div`
  display: flex;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const BenefitCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const QuoteCard = styled(Card)`
  && {
    gap: ${({ theme }) => theme.spacing.small};
    padding: ${({ theme }) =>
      `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall} + ${theme.spacing.xxxxsmall})`};
    border-radius: ${({ theme }) => theme.radius.xlarge};
    border: none;
    box-shadow: ${softCardShadowValue};
    background: ${({ theme }) => theme.color.surface.primary};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        padding: ${theme.spacing.medium};
      }
    }
  `}
`;

export const QuoteMark = styled(Text)`
  color: ${({ theme }) => theme.color.text.highlight};
  line-height: 0.75;
  margin: 0;
  margin-top: -16px;
`;

export const QuoteText = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
  line-height: 1.25;
  overflow-wrap: break-word;
  margin: 0;
`;

export const PersonRow = styled.div<{ $spread?: boolean }>`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ $spread }) =>
    $spread &&
    css`
      justify-content: space-between;
      width: 100%;
    `}
`;

const avatarSize = css<{ $size?: 'medium' | 'large' }>`
  flex-shrink: 0;
  width: ${({ theme, $size }) =>
    $size === 'large'
      ? theme.spacing.xxxlarge
      : `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
  height: ${({ theme, $size }) =>
    $size === 'large'
      ? theme.spacing.xxxlarge
      : `calc(${theme.spacing.xlarge} + ${theme.spacing.xsmall})`};
  border-radius: ${({ theme }) => theme.radius.half};
  border: ${({ theme }) => theme.spacing.xxxxsmall} solid
    ${({ theme }) => theme.color.surface.primary};
  box-shadow: 0 ${({ theme }) => theme.spacing.xxxsmall}
    ${({ theme }) => theme.spacing.small} rgb(0 0 0 / 8%);
`;

export const InitialsAvatar = styled(Text).attrs({
  type: TextTypes.Heading7,
  tag: 'div' as const,
})<{
  $size?: 'medium' | 'large';
  $tone?: 'highlight' | 'bold';
}>`
  display: flex;
  align-items: center;
  justify-content: center;
  ${avatarSize}
  background: ${({ theme, $tone }) =>
    $tone === 'highlight'
      ? theme.color.surface.highlight
      : theme.color.surface.bold};
  color: ${({ theme }) => theme.color.text.button};
`;

export const PhotoAvatar = styled.img<{ $size?: 'medium' | 'large' }>`
  display: block;
  object-fit: cover;
  object-position: center;
  ${avatarSize}
`;

export const QuoteCompanyLogo = styled.img`
  display: block;
  flex-shrink: 0;
  height: ${({ theme }) => theme.spacing.medium};
  width: auto;
  max-width: ${({ theme }) => theme.spacing.xxxxlarge};
  object-fit: contain;
`;

export const PersonCopy = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
  min-width: 0;
  text-align: left;
`;

export const PersonName = styled(Text).attrs({
  type: TextTypes.Heading7,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
  margin: 0;
`;

export const PersonRole = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  margin: 0;
`;

export const StepsRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const StepCard = styled(Card)`
  && {
    flex: 1;
    flex-direction: row;
    align-items: center;
    gap: ${({ theme }) => theme.spacing.small};
    padding: ${({ theme }) =>
      `${`calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall})`} ${theme.spacing.small}`};
    border-radius: ${({ theme }) => theme.radius.large};
    border: none;
    box-shadow: ${softCardShadowValue};
    background: ${({ theme }) => theme.color.surface.primary};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        padding: ${theme.spacing.small} ${theme.spacing.medium};
      }
    }
  `}
`;

export const StepNumber = styled(Text).attrs({
  type: TextTypes.Heading7,
  tag: 'div' as const,
})`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ theme }) => theme.spacing.xlarge};
  height: ${({ theme }) => theme.spacing.xlarge};
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme }) => theme.color.surface.accent};
  color: ${({ theme }) => theme.color.text.title};
`;

export const StepText = styled(Text).attrs({
  type: TextTypes.Heading7,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
  overflow-wrap: break-word;
  margin: 0;
`;

export const StoriesGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      grid-template-columns: 1fr 1fr;
      gap: ${theme.spacing.medium};
    }
  `}
`;

export const StoryCard = styled(Card)`
  && {
    gap: ${({ theme }) => theme.spacing.small};
    padding: ${({ theme }) =>
      `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall} + ${theme.spacing.xxxxsmall})`};
    border-radius: ${({ theme }) => theme.radius.xlarge};
    border: none;
    box-shadow:
      inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
        ${({ theme }) => theme.color.border.subtle},
      ${softCardShadowValue};
    background: ${({ theme }) => theme.color.surface.primary};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        padding: ${theme.spacing.medium};
      }
    }
  `}
`;

export const AvatarStack = styled.div`
  display: flex;

  > * {
    box-shadow: ${softAvatarShadowValue};
  }

  > *:not(:first-child) {
    margin-left: ${({ theme }) => `calc(${theme.spacing.small} * -1)`};
  }
`;

export const StoryNames = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'h3' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
  margin: 0;
`;

export const StoryQuote = styled(Text).attrs({
  type: TextTypes.Body4,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
  line-height: 1.45;
  margin: 0;
`;

export const StoryQuoteMark = styled.span`
  color: ${({ theme }) => theme.color.text.highlight};
`;

export const StorySpeaker = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const StoryContext = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  margin: 0;
`;

export const StoryReadButton = styled(Button)`
  align-self: flex-start;
  width: auto;
`;

export const StoryModalCard = styled(Card)`
  max-height: 90vh;
  overflow: hidden;
`;

export const StoryModalHeader = styled(CardHeader)`
  gap: ${({ theme }) => theme.spacing.small};
`;

export const StoryModalTitle = styled(Text).attrs({
  type: TextTypes.Heading4,
  tag: 'h2' as const,
})`
  color: ${({ theme }) => theme.color.text.heading};
  margin: 0;
  text-align: left;
`;

export const StoryModalKicker = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  font-style: italic;
  margin: 0;
`;

export const StoryModalBody = styled(CardContent)`
  flex: 1;
  min-height: 0;
  align-items: stretch;
  overflow-y: auto;
`;

export const StoryModalSection = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const StoryModalHeading = styled(Text).attrs({
  type: TextTypes.Heading6,
  tag: 'h3' as const,
})`
  color: ${({ theme }) => theme.color.text.bold};
  margin: ${({ theme }) => theme.spacing.xsmall} 0 0;
`;

export const StoryModalParagraph = styled(Text).attrs({
  type: TextTypes.Body4,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.primary};
  line-height: 1.5;
  margin: 0;
`;

export const FaqInner = styled(SectionInner)`
  max-width: ${({ theme }) => theme.breakpoints.xlarge};
`;

export const FaqAccordion = styled(Accordion)`
  border: none;
  background: transparent;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};

  > * {
    background: ${({ theme }) => theme.color.surface.primary};
    border: 2px solid ${({ theme }) => theme.color.border.subtle};
    border-radius: ${({ theme }) => theme.radius.large};
    padding-top: ${({ theme }) => theme.spacing.small};
    padding-bottom: ${({ theme }) => theme.spacing.xxsmall};
  }

  button {
    overflow-wrap: break-word;
  }
`;

export const FaqAccordionContent = styled(AccordionContent)`
  background: ${({ theme }) => theme.color.surface.primary};
  padding: 0 0 ${({ theme }) => theme.spacing.small};
  margin: 0;
  line-height: 1.55;
`;

export const PageFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  padding-top: ${({ theme }) =>
    `calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`};
  padding-bottom: ${({ theme }) =>
    `calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`};
  ${pageSidePadding}
  background: ${({ theme }) => theme.color.surface.primary};
  border-top: ${({ theme }) => theme.spacing.xxxxsmall} solid
    ${({ theme }) => theme.color.border.subtle};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding-top: ${theme.spacing.medium};
      padding-bottom: ${theme.spacing.medium};
    }
  `}
`;

export const FooterBrand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};

  img {
    height: ${({ theme }) => theme.spacing.large};
    width: auto;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      flex-wrap: wrap;
      align-items: center;
    }
  `}
`;

export const FooterCopy = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  margin: 0;
`;

export const FooterLinks = styled.nav`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.medium};
`;
