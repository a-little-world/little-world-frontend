import { Text, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import styled from 'styled-components';

export const Unread = styled(Text)<{ $onIcon?: boolean }>`
  position: absolute;
  top: ${({ $onIcon }) => ($onIcon ? '-9px' : '-6px')};
  right: ${({ $onIcon }) => ($onIcon ? '-9px' : '-6px')};
  background: ${({ theme }) => theme.color.surface.highlight};
  color: ${({ theme }) => theme.color.text.button};
  height: ${({ $onIcon }) => ($onIcon ? '18px' : '22px')};
  aspect-ratio: 1;
  border-radius: 100%;
  font-weight: 600;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  line-height: 100%;
`;

function UnreadDot({ count, onIcon }: { count: number; onIcon?: boolean }) {
  return (
    <Unread type={TextTypes.Body6} bold $onIcon={onIcon}>
      {count}
    </Unread>
  );
}

export default UnreadDot;
