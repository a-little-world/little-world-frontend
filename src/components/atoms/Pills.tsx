import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

const outlineWidth = '2px';

export type PillTone = 'neutral' | 'accent' | 'eyebrow';
export type PillSize = 'small' | 'medium' | 'large';
export type PillBorder = 'none' | 'message' | 'info';

export const Pills = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  margin-bottom: ${({ theme }) => theme.spacing.medium};
`;

export const Pill = styled(Text).attrs<{
  $tone?: PillTone;
  $textType?: TextTypes;
}>(({ $textType, $tone = 'neutral' }) => ({
  tag: 'span' as const,
  type: $textType ?? TextTypes.Body6,
  bold: $tone !== 'neutral',
}))<{
  $tone?: PillTone;
  $size?: PillSize;
  $border?: PillBorder;
  $nowrap?: boolean;
  $spaced?: boolean;
  $textType?: TextTypes;
}>`
  display: inline-flex;
  align-items: center;
  flex: 0 0 auto;
  max-width: 100%;

  ${({
    theme,
    $tone = 'neutral',
    $size = 'large',
    $border = 'none',
    $nowrap,
    $spaced,
  }) => {
    let padding = `${theme.spacing.xsmall} ${theme.spacing.small}`;
    if ($tone === 'eyebrow') {
      padding = `${theme.spacing.xxxsmall} ${theme.spacing.small}`;
    } else if ($size === 'small') {
      padding = `${theme.spacing.xxxsmall} ${theme.spacing.xsmall}`;
    } else if ($size === 'medium') {
      padding = `${theme.spacing.xxsmall} ${theme.spacing.small}`;
    }

    let background = theme.color.surface.secondary;
    let color = theme.color.text.secondary;
    const radius = theme.radius.massive;
    if ($tone === 'eyebrow') {
      background = `color-mix(in srgb, ${theme.color.text.info} 55%, transparent)`;
      color = theme.color.text.button;
    } else if ($tone === 'accent') {
      background = theme.color.surface.primary;
      color = theme.color.text.title;
    }

    const borderKind = $tone === 'eyebrow' ? 'info' : $border;
    let borderColor: string | null = null;
    if (borderKind === 'message') borderColor = theme.color.border.message;
    if (borderKind === 'info') borderColor = theme.color.border.info;

    const gap =
      $tone === 'neutral' && $size === 'large'
        ? theme.spacing.xsmall
        : theme.spacing.xxsmall;

    return css`
      gap: ${gap};
      padding: ${padding};
      border: ${borderColor ? `${outlineWidth} solid ${borderColor}` : 0};
      border-radius: ${radius};
      background: ${background};
      color: ${color};
      ${$tone === 'eyebrow' ? 'align-self: flex-start;' : ''}

      && {
        font-weight: ${$tone === 'neutral' ? 600 : 700};
        ${$tone === 'neutral'
          ? css`
              font-size: 0.875rem;
              line-height: normal;
            `
          : ''}
        ${$nowrap ? 'white-space: nowrap;' : ''}
        ${$spaced ? `margin: 0 0 ${theme.spacing.xxsmall};` : ''}
      }
    `;
  }}
`;
