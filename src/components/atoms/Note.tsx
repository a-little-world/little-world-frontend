import {
  InfoIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledNote = styled.div<{ $center: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $center }) => ($center ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const StyledInfoIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.color.status.info};
  flex-shrink: 0;
`;

const Note = ({
  children,
  center = true,
  className,
  withIcon = true,
}: PropsWithChildren<{
  withIcon?: boolean;
  center?: boolean;
  className?: string;
}>) => (
  <StyledNote $center={center} className={className}>
    {withIcon && (
      <StyledInfoIcon height="16px" width="16px" label="info icon" />
    )}
    <Text type={TextTypes.Body6} color="#A6A6A6">
      {children}
    </Text>
  </StyledNote>
);

export default Note;
