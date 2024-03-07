import React from 'react';
import styled from 'styled-components';

export const Toolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  //   gap: ${({ theme }) => theme.spacing.small};
  border: 1px solid ${({ theme }) => theme.color.border.moderate};

  border-radius: 20px;

  > div {
    padding: 8px;
    display: flex;
    gap: 8px;
    align-items: center;
    justify-content: center;

    &:not(:last-child) {
      border-right: 1px solid black;
    }
  }
`;

export const Notification = styled.div<{ $state: string }>`
  display: flex;
  flex-direction: column;
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 20px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
  gap: ${({ theme }) => theme.spacing.small};
`;

export const Options = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const Items = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const Info = styled.div``;

export const UnreadIndicator = styled.div``;

export const BottomContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CreatedAt = styled.div``;
