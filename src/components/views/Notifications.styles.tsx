import { motion } from 'motion/react';
import styled, { css } from 'styled-components';

import CustomPagination from '../../CustomPagination';

export const Notification = styled(motion.div)<{
  $state: string;
  $highlight?: boolean;
}>`
  display: flex;
  flex-direction: column;
  border: 2px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 20px;
  width: 100%;
  max-width: 720px;
  padding: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme, $highlight }) =>
    $highlight &&
    css`
      border-color: ${theme.color.border.selected};
    `}
`;

export const Options = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const Items = styled.ul`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `}
`;

export const Info = styled.div``;

export const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CreatedAt = styled.div<{ $highlight?: boolean }>`
  color: ${({ theme, $highlight }) =>
    $highlight ? theme.color.text.reversed : theme.color.status.info};
`;

export const RelativeDiv = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  flex: 1;
  min-height: 64px;
`;

export const BottomAlignedPagination = styled(CustomPagination)`
  position: absolute;
  bottom: 10px;
  left: 0;
  right: 0;
`;
