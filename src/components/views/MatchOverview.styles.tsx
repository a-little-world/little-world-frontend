import {
  Card,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const OverviewPage = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  max-width: ${({ theme }) => theme.breakpoints.large};
  margin: 0 auto;
  padding: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `};
`;

export const OverviewCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.large};
  width: 100%;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.radius.xlarge};
  border-color: ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
`;

export const HeaderBlock = styled.header`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const AvatarPair = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const OverlapAvatar = styled.div`
  margin-left: calc(-1 * ${({ theme }) => theme.spacing.small});
  border-radius: ${({ theme }) => theme.radius.half};
  box-shadow: 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
    color-mix(
      in srgb,
      ${({ theme }) => theme.color.surface.primary} 55%,
      transparent
    );
  z-index: 1;

  &:first-child {
    margin-left: 0;
    z-index: 0;
    box-shadow: none;
  }
`;

export const TitleGroup = styled.div`
  display: flex;
  flex-direction: column;
`;

export const PageTitle = styled(Text).attrs({
  type: TextTypes.Heading4,
  tag: 'h1' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.title};
`;

export const MatchSince = styled(Text).attrs({
  type: TextTypes.Body5,
})`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const ProgressHero = styled.section`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      align-items: center;
      gap: ${theme.spacing.large};
    }
  `};
`;

export const ProgressCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
  flex: 1;
  min-width: 0;
  text-align: center;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      text-align: left;
    }
  `};
`;

export const ProgressHeading = styled(Text).attrs({
  type: TextTypes.Heading5,
  tag: 'h2' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.heading};
`;

export const ProgressBody = styled(Text).attrs({
  type: TextTypes.Body4,
})`
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const CtaBlock = styled.div`
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-top: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      align-items: flex-start;
      width: auto;
    }
  `};

  > button {
    width: 100%;

    ${({ theme }) => css`
      @media (min-width: ${theme.breakpoints.medium}) {
        width: auto;
      }
    `};
  }
`;

export const CtaContext = styled(Text).attrs({
  type: TextTypes.Body5,
})`
  color: ${({ theme }) => theme.color.text.tertiary};
`;

export const StatsStrip = styled.section`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: baseline;
  gap: ${({ theme }) => theme.spacing.small}
    ${({ theme }) => theme.spacing.medium};
  padding: ${({ theme }) => theme.spacing.xsmall}
    ${({ theme }) => theme.spacing.small};
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme }) => theme.color.surface.subtle};
`;

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const SectionHeading = styled(Text).attrs({
  type: TextTypes.Heading5,
  tag: 'h2' as const,
  bold: true,
  center: true,
})`
  color: ${({ theme }) => theme.color.text.heading};
`;

export const BadgeGrid = styled.ul`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: ${({ theme }) => theme.spacing.medium}
    ${({ theme }) => theme.spacing.small};
  margin: 0;
  padding: 0;
  list-style: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      grid-template-columns: repeat(6, minmax(0, 1fr));
    }
  `};
`;

export const BadgeItem = styled.li`
  min-width: 0;
`;

export const CallList = styled.ul`
  margin: 0;
  padding: 0;
  list-style: none;
`;

export const ShowAllWrap = styled.div`
  display: flex;
  justify-content: center;
`;
