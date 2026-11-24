import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export type CalendarOptionSize = 'compact' | 'regular';

export const CalendarList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const CalendarOption = styled.button<{ $size: CalendarOptionSize }>`
  display: flex;
  align-items: center;
  width: 100%;
  border: none;
  border-radius: ${({ theme }) => theme.radius.small};
  background: ${({ theme }) => theme.color.surface.primary};
  box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
    ${({ theme }) => theme.color.border.subtle};
  text-align: left;
  cursor: pointer;
  transition: box-shadow 160ms ease;
  gap: ${({ theme, $size }) =>
    $size === 'compact' ? theme.spacing.xsmall : theme.spacing.small};
  padding: ${({ theme, $size }) => {
    if ($size === 'compact') {
      return `${theme.spacing.xxsmall} ${theme.spacing.xsmall}`;
    }
    return `calc(${theme.spacing.xsmall} + ${theme.spacing.xxxxsmall}) ${theme.spacing.small}`;
  }};

  &:hover {
    box-shadow: inset 0 0 0 ${({ theme }) => theme.spacing.xxxxsmall}
      ${({ theme }) => theme.color.border.highlight};
  }
`;

export const CalendarOptionCopy = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxxsmall};
  min-width: 0;
  flex: 1;
`;

export const CalendarOptionTitle = styled(Text).attrs({
  type: TextTypes.Body5,
  tag: 'span' as const,
  bold: true,
})`
  color: ${({ theme }) => theme.color.text.bold};
`;

export const CalendarOptionSubtitle = styled(Text).attrs({
  type: TextTypes.Body6,
  tag: 'span' as const,
})`
  color: ${({ theme }) => theme.color.text.quaternary};
`;

export const CalendarChevron = styled.span`
  display: flex;
  opacity: 0.5;
  flex-shrink: 0;
`;
