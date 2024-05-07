import React from 'react';
import styled from 'styled-components';

export const Unread = styled.div`
  position: absolute;
  top: ${({ theme }) => theme.spacing.xxsmall};
  right: ${({ theme }) => theme.spacing.xxsmall};
  background: ${({ theme }) => theme.color.surface.highlight};
  color: ${({ theme }) => theme.color.text.button};
  height: 16px;
  aspect-ratio: 1;
  border-radius: 100%;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 100%;
`;

function UnreadDot({ count }: { count: number }) {
  return <Unread>{count}</Unread>;
}

export default UnreadDot;
