import styled, { css, keyframes } from 'styled-components';

export const shimmer = keyframes`
  to {
    background-position: 200% 0;
  }
`;

export const shimmerGradient = css`
  linear-gradient(270deg, ${({ theme }) =>
    `${theme.color.surface.secondary} 0%, ${theme.color.surface.primary} 25%, ${theme.color.surface.primary} 50%, ${theme.color.surface.secondary} 75%, ${theme.color.surface.secondary} 100%`})
`;

export const shimmerStyles = css`
  background: ${shimmerGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 3s infinite ease-in;
  overflow: hidden;
`;

// Generic loading component with shimmer effect
export const ShimmerLoading = styled.div`
  ${shimmerStyles}
`;

// Loading line component for text placeholders
export const LoadingLine = styled.div<{ $width?: string; $height?: string }>`
  height: ${({ $height }) => $height || '12px'};
  border-radius: ${({ theme }) => theme.radius.xxsmall};
  background: ${shimmerGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 2.5s infinite ease-in reverse;
  width: ${({ $width }) => $width || '100%'};
`;
