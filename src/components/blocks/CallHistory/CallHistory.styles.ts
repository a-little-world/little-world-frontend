import { Button, Text } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const Container = styled.div<{ $hasData: boolean }>`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.small};
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;

  ${({ $hasData }) =>
    !$hasData &&
    css`
      align-items: center;
      justify-content: center;
      padding: ${({ theme }) =>
        `${theme.spacing.massive} ${theme.spacing.small}`};
    `}
`;

export const NoHistoryDescription = styled(Text)`
  text-align: center;
  max-width: 512px;
`;

export const CallHistoryListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CallEntry = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => `${theme.spacing.xxsmall} ${theme.spacing.small}`};
  justify-content: space-between;
  width: 100%;
  flex-wrap: wrap;

  &:not(:last-child) {
    border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
  }
`;

export const CallInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const CallDetails = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CallDateTime = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CallDate = styled.span`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const CallTime = styled(CallDate)`
  display: inline-flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const RequestMatchButton = styled(Button)`
  align-self: end;
`;
