import { Button, Text } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const CourseContainer = styled.div`
  width: 100%;

  @media (prefers-reduced-motion: reduce) {
    * {
      animation-duration: 0.01ms !important;
      animation-iteration-count: 1 !important;
      transition-duration: 0.01ms !important;
    }
  }
`;

export const Header = styled.header`
  background: ${({ theme }) => theme.color.surface.primary};
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const HeaderContent = styled.div`
  width: 100%;
  max-width: 1240px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
`;

export const HeaderTitleRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: grid;
      grid-template-columns: 1fr auto 1fr;
      align-items: center;
      padding: 0 ${theme.spacing.small} ${theme.spacing.xxsmall};
    }
  `}
`;

export const HeaderBackCell = styled.div`
  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      justify-self: start;
    }
  `}
`;

export const HeaderTitleCenter = styled.div`
  display: none;
  min-width: 0;
  text-align: center;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: block;
      justify-self: center;
    }
  `}
`;

export const HeaderTitleTrailing = styled.div`
  display: none;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      display: block;
    }
  `}
`;

export const HeaderTitle = styled(Text)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  max-width: 100%;
`;

export const BackButton = styled(Button)`
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  font-weight: 600;
  padding: ${({ theme }) => theme.spacing.xxsmall} !important;
  flex-shrink: 0;
  text-align: left;

  > svg {
    flex-shrink: 0;
  }
`;

export const ProgressRow = styled.div`
  padding: ${({ theme }) => theme.spacing.xxsmall};
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small} ${theme.spacing.small}
        ${theme.spacing.xxsmall};
    }
  `}
`;

export const ChaptersNav = styled.nav`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacing.xsmall};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.small} ${theme.spacing.medium};
    }
  `}
`;

export const ChapterButton = styled.button<{
  $isActive?: boolean;
  $isCompleted?: boolean;
  $isLocked?: boolean;
}>`
  min-height: 44px;
  min-width: 130px;
  border-radius: ${({ theme }) => theme.radius.large};
  padding: ${({ theme }) => theme.spacing.xsmall};
  border: 2px solid
    ${({ theme, $isActive, $isCompleted }) => {
      if ($isActive) return theme.color.border.selected;
      if ($isCompleted) return theme.color.border.success;
      return theme.color.border.subtle;
    }};
  background: ${({ theme, $isActive, $isCompleted }) => {
    if ($isActive) return theme.color.surface.primary;
    if ($isCompleted) return theme.color.surface.success;
    return theme.color.surface.secondary;
  }};
  color: ${({ theme, $isLocked }) =>
    $isLocked ? theme.color.text.secondary : theme.color.text.heading};
  cursor: ${({ $isLocked }) => ($isLocked ? 'not-allowed' : 'pointer')};
  opacity: ${({ $isLocked }) => ($isLocked ? 0.6 : 1)};
  transition: transform 160ms ease, box-shadow 160ms ease;

  &:hover:not(:disabled) {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
  }

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.xsmall} ${theme.spacing.medium};
    }
  `}
`;

export const ChapterTitle = styled(Text)`
  font-size: 14px;
  font-weight: 600;
`;

export const ChapterSub = styled(Text)`
  font-size: 12px;
  color: ${({ theme }) => theme.color.text.secondary};
`;

export const Main = styled.main`
  padding: ${({ theme }) => `${theme.spacing.medium} ${theme.spacing.small}`};
  max-width: 1240px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
    }
  `}
`;

export const ChapterContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

export const ChapterFooter = styled.div`
  display: flex;
  order: 1;
  justify-content: space-between;
  align-items: center;
  margin-top: auto;
  gap: ${({ theme }) => theme.spacing.small};
  width: 100%;
  max-width: 960px; // video max width
  margin: 0 auto;
`;

export const VideoWrapper = styled.div`
  overflow: hidden;
  flex: 1;
  width: 100%;
`;

export const FooterPrimaryButton = styled(Button)`
  margin-left: auto;
`;
