import {
  InfoIcon,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { PropsWithChildren } from 'react';
import styled from 'styled-components';

const StyledNote = styled.div<{ $center: boolean }>`
  display: flex;
  align-items: center;
  justify-content: ${({ $center }) => ($center ? 'center' : 'flex-start')};
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const StyledInfoIcon = styled(InfoIcon)`
  color: ${({ theme }) => theme.color.surface.bold};
  flex-shrink: 0;
`;

const NoteText = styled(Text)`
  color: ${({ theme }) => theme.color.text.tertiary};
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
    <NoteText type={TextTypes.Body6}>{children}</NoteText>
  </StyledNote>
);

export default Note;
