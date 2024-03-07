import React from 'react';
import styled from 'styled-components';

export const Toolbar = styled.div``;

export const Notification = styled.div<{ $state: string }>`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 20px;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
`;

export const Items = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const Info = styled.div``;

export const UnreadIndicator = styled.div``;

export const Status = styled.div``;
