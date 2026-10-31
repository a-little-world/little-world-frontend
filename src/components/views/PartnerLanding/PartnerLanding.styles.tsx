import {
  Accordion,
  AccordionContent,
  Button,
  Card,
  Link,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import Logo from '../../atoms/Logo';

export const Page = styled.main`
  min-height: 100vh;
  background: ${({ theme }) => theme.color.surface.primary};
  color: ${({ theme }) => theme.color.text.primary};
`;

const sectionPadding = css`
  padding: ${({ theme }) => theme.spacing.xxxlarge}
    ${({ theme }) => `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xxxxlarge} ${theme.spacing.massive};
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
  tag: 'p' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.heading};
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
  color: ${({ theme }) => theme.color.text.button};
  background: ${({ theme }) => theme.color.text.info};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      min-height: 60rem;
    }
  `}

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        ellipse at 80% 40%,
        ${({ theme }) => theme.color.surface.highlight} 0%,
        transparent 45%
      ),
      ${({ theme }) => theme.color.text.info};
    object-fit: cover;
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(
      90deg,
      color-mix(
          in srgb,
          ${({ theme }) => theme.color.text.info} 90%,
          transparent
        )
        0%,
      color-mix(
          in srgb,
          ${({ theme }) => theme.color.text.info} 70%,
          transparent
        )
        36%,
      transparent 64%
    );

    ${({ theme }) => css`
      @media (max-width: ${theme.breakpoints.small}) {
        background: color-mix(
          in srgb,
          ${theme.color.text.info} 75%,
          transparent
        );
      }
    `}
  }
`;

export const NavBar = styled.nav`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.sticky};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) =>
    `calc(${theme.spacing.xxxxlarge} - ${theme.spacing.xlarge})`};
  padding: 0
    ${({ theme }) => `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      height: ${theme.spacing.xxxlarge};
      padding: 0 ${theme.spacing.xxxlarge};
    }
  `}
`;

export const HomeLink = styled.a`
  display: inline-flex;
  align-items: center;
  flex-shrink: 0;
  text-decoration: none;
  color: inherit;
`;

export const WhiteLogo = styled(Logo)`
  filter: brightness(0) invert(1);
  flex-shrink: 0;

  && {
    height: ${({ theme }) =>
      `calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`};
    overflow: hidden;
  }

  && > div:first-child {
    display: none;
  }

  && > div:last-child {
    width: auto !important;
    height: 100%;
  }

  && img {
    height: 100% !important;
    width: auto !important;
    max-height: 100%;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      && {
        height: ${theme.spacing.xlarge};
        overflow: visible;
      }

      && > div:first-child {
        display: block;
        width: ${theme.spacing.xxxlarge} !important;
      }

      && > div:last-child {
        width: ${theme.spacing.xxxlarge} !important;
      }

      && img {
        width: 100% !important;
        height: 100% !important;
      }
    }
  `}
`;

export const PartnerPill = styled.div`
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  max-width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};
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

export const PartnerName = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.heading};
  text-transform: uppercase;
`;

export const Garland = styled.div`
  position: relative;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.spacing.large};
  padding: 0
    ${({ theme }) => `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`};
  pointer-events: none;

  > :nth-child(n + 13) {
    display: none;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0 ${theme.spacing.xxxlarge};

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
  padding: 0
    ${({ theme }) => `calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`}
    ${({ theme }) => theme.spacing.xlarge};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xxsmall} ${theme.spacing.xxxlarge}
        ${theme.spacing.xlarge};
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
      flex: 1;
      justify-content: center;
    }
  `}
`;

export const HeroMedia = styled.div`
  position: relative;
  width: 100%;
  height: ${({ theme }) =>
    `calc(${theme.spacing.xxxxlarge} * 2 + ${theme.spacing.xlarge})`};
  overflow: hidden;
  border-radius: ${({ theme }) => theme.radius.large};
  background:
    radial-gradient(
      ellipse at 80% 40%,
      ${({ theme }) => theme.color.surface.highlight} 0%,
      transparent 55%
    ),
    ${({ theme }) => theme.color.text.info};

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
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
  tag: 'p' as const,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
  margin: 0;
`;

export const HeroBadgeText = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'p' as const,
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
  box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
    ${({ theme }) => theme.color.border.message};
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
  box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
    ${({ theme }) => theme.color.border.message};
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
  padding: ${({ theme }) =>
    `${`calc(${theme.spacing.xlarge} + ${theme.spacing.xxsmall})`} ${`calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`}`};
  color: ${({ theme }) => theme.color.text.button};
  background: ${({ theme }) => theme.color.text.info};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xxxxlarge} ${theme.spacing.massive};
      gap: ${theme.spacing.medium};
    }
  `}

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background:
      radial-gradient(
        ellipse at 50% 0%,
        ${({ theme }) => theme.color.surface.highlight} 0%,
        transparent 55%
      ),
      ${({ theme }) => theme.color.text.info};
  }

  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: color-mix(
      in srgb,
      ${({ theme }) => theme.color.text.info} 62%,
      transparent
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
  type: TextTypes.Heading4,
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
    @media (min-width: ${theme.breakpoints.medium}) {
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
    box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.border.subtle};
    background: ${({ theme }) => theme.color.surface.primary};
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
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

export const SplitColumn = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) =>
    `calc(${theme.spacing.small} + ${theme.spacing.xxxxsmall})`};
  min-width: 0;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex: 1;
      gap: ${theme.spacing.medium};
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
    box-shadow: none;
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

export const QuoteMark = styled(Text).attrs({
  type: TextTypes.Heading3,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.highlight};
  line-height: 1;
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

export const PersonRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
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
  background: ${({ theme, $tone }) =>
    $tone === 'highlight'
      ? theme.color.surface.highlight
      : theme.color.surface.bold};
  color: ${({ theme }) => theme.color.text.button};
  box-shadow: 0 ${({ theme }) => theme.spacing.xxxsmall}
    ${({ theme }) => theme.spacing.small} rgb(0 0 0 / 8%);
`;

export const PersonCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
  min-width: 0;
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
    box-shadow: none;
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
    box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.border.subtle};
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

export const StoryLink = styled(Link)`
  align-self: flex-start;
  width: auto;
`;

export const FaqSection = styled(Section)`
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding-left: calc(
        ${theme.spacing.xxxxlarge} * 2 + ${theme.spacing.xlarge} +
          ${theme.spacing.xsmall}
      );
      padding-right: calc(
        ${theme.spacing.xxxxlarge} * 2 + ${theme.spacing.xlarge} +
          ${theme.spacing.xsmall}
      );
    }
  `}
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
    margin: 0;
    width: 100%;
    background: ${({ theme }) => theme.color.surface.primary};
    border: none;
    border-radius: ${({ theme }) => theme.radius.large};
    box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.border.subtle};
    padding: 0 ${({ theme }) => theme.spacing.medium};
  }

  button {
    overflow-wrap: break-word;
  }
`;

export const FaqAccordionContent = styled(AccordionContent)`
  background: ${({ theme }) => theme.color.surface.primary};
  padding: 0 0 ${({ theme }) => theme.spacing.medium};
  margin: 0;
  color: ${({ theme }) => theme.color.text.tertiary};
  line-height: 1.55;
`;

export const PageFooter = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) =>
    `${`calc(${theme.spacing.medium} + ${theme.spacing.xxxsmall})`} ${`calc(${theme.spacing.small} + ${theme.spacing.xxxsmall})`}`};
  background: ${({ theme }) => theme.color.surface.primary};
  border-top: ${({ theme }) => theme.spacing.xxxxsmall} solid
    ${({ theme }) => theme.color.border.subtle};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: ${theme.spacing.medium} ${theme.spacing.massive};
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
