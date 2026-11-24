import styled, { css } from 'styled-components';

const pageSidePadding = css`
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

export const GarlandRow = styled.div<{
  $padding?: string;
  $top?: string;
  $compactCount: number;
}>`
  position: absolute;
  top: ${({ $top }) => $top ?? '-12px'};
  left: 0;
  right: 0;
  box-sizing: border-box;
  width: auto;
  max-width: 100%;
  z-index: ${({ theme }) => theme.zIndex.above};
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: ${({ theme }) => theme.spacing.large};
  padding-top: 0;
  padding-bottom: 0;
  ${({ $padding }) =>
    $padding
      ? css`
          padding-left: ${$padding};
          padding-right: ${$padding};
        `
      : pageSidePadding}
  pointer-events: none;

  > :nth-child(n + ${({ $compactCount }) => $compactCount + 1}) {
    display: none;
  }

  ${({ theme, $top, $compactCount }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      top: ${$top ?? '0'};

      > :nth-child(n + ${$compactCount + 1}) {
        display: block;
      }
    }
  `}
`;

export type GarlandTone = 'highlight' | 'accent' | 'heading' | 'title';

export const GarlandLight = styled.span<{
  $tone: GarlandTone;
  $wave: number;
  $curvature: number;
}>`
  flex: 0 1 ${({ theme }) => theme.spacing.xxsmall};
  width: ${({ theme }) => theme.spacing.xxsmall};
  max-width: ${({ theme }) => theme.spacing.xxsmall};
  min-width: 0;
  height: ${({ theme }) => theme.spacing.xxsmall};
  border-radius: ${({ theme }) => theme.radius.half};
  transform: translateY(
    calc(
      ${({ theme }) => theme.spacing.xsmall} * ${({ $wave }) => $wave} *
        ${({ $curvature }) => $curvature}
    )
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
