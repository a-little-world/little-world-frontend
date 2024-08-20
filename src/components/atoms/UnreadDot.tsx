import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

export const Unread = styled(Text)`
  position: absolute;
  top: -6px;
  right: -6px;
  background: ${({ theme }) => theme.color.surface.highlight};
  color: ${({ theme }) => theme.color.text.button};
  height: 22px;
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
  return (
    <Unread type={TextTypes.Body6} bold>
      {count}
    </Unread>
  );
}

export default UnreadDot;
