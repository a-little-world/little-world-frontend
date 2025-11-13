import { Button } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const ToolContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
`;

export const DropdownsRow = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: flex-start;
  width: 100%;
`;

export const SwapBtn = styled(Button)`
  padding: ${({ theme }) => theme.spacing.xxxsmall};
  margin-top: 6px;
  border-radius: ${({ theme }) => theme.radius.half};
  color: ${({ theme }) => theme.color.text.title};
`;

export const TextAreasRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      flex-direction: row;
      gap: 42px;
    }
  `}
`;
