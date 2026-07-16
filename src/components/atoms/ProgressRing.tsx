import React from 'react';
import styled, { css, useTheme } from 'styled-components';

export type ProgressRingSize = 'hero' | 'badge';
export type ProgressRingTone = 'accent' | 'success';

export interface ProgressRingProps {
  value: number;
  max: number;
  label: string;
  size?: ProgressRingSize;
  tone?: ProgressRingTone;
  /** Optional center caption under the fraction, e.g. "Wochen". */
  caption?: string;
  className?: string;
  children?: React.ReactNode;
}

const RingWrap = styled.div<{ $size: ProgressRingSize }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  ${({ theme, $size }) =>
    $size === 'hero'
      ? css`
          width: calc(${theme.spacing.xxxxlarge} + ${theme.spacing.small});
          height: calc(${theme.spacing.xxxxlarge} + ${theme.spacing.small});
        `
      : css`
          width: calc(${theme.spacing.xxxlarge} + ${theme.spacing.xxsmall});
          height: calc(${theme.spacing.xxxlarge} + ${theme.spacing.xxsmall});
        `}
`;

const Svg = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
`;

const InnerDisc = styled.div<{ $size: ProgressRingSize }>`
  position: absolute;
  border-radius: ${({ theme }) => theme.radius.half};
  background: ${({ theme }) => theme.color.surface.primary};
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  line-height: 1.1;
  overflow: hidden;

  ${({ theme, $size }) =>
    $size === 'hero'
      ? css`
          inset: ${theme.spacing.xsmall};
        `
      : css`
          inset: ${theme.spacing.xxxsmall};
        `}
`;

const Fraction = styled.span`
  display: inline-flex;
  align-items: baseline;
  font-weight: 700;
  color: ${({ theme }) => theme.color.text.heading};
  line-height: 1;
`;

const FractionValue = styled.span`
  font-size: 1.75rem;
`;

const FractionRest = styled.span`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.text.secondary};
`;

const Caption = styled.span`
  font-size: 0.75rem;
  font-weight: 600;
  color: ${({ theme }) => theme.color.text.secondary};
`;

function ProgressRing({
  value,
  max,
  label,
  size = 'hero',
  tone = 'accent',
  caption,
  className,
  children,
}: ProgressRingProps) {
  const theme = useTheme();
  const safeMax = max > 0 ? max : 1;
  const clamped = Math.min(Math.max(value, 0), safeMax);
  const progress = clamped / safeMax;

  const viewBox = 100;
  const stroke = size === 'hero' ? 8 : 4;
  const radius = (viewBox - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - progress);

  const trackColor = theme.color.border.subtle;
  const fillColor =
    tone === 'success'
      ? theme.color.border.success
      : theme.color.border.selected;

  return (
    <RingWrap
      className={className}
      $size={size}
      role="img"
      aria-label={label}
    >
      <Svg viewBox={`0 0 ${viewBox} ${viewBox}`} aria-hidden>
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        <circle
          cx={viewBox / 2}
          cy={viewBox / 2}
          r={radius}
          fill="none"
          stroke={fillColor}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </Svg>
      <InnerDisc $size={size}>
        {children ?? (
          <>
            {size === 'hero' && (
              <>
                <Fraction>
                  <FractionValue>{clamped}</FractionValue>
                  <FractionRest>/{safeMax}</FractionRest>
                </Fraction>
                {caption ? <Caption>{caption}</Caption> : null}
              </>
            )}
          </>
        )}
      </InnerDisc>
    </RingWrap>
  );
}

export default ProgressRing;
