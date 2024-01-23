import { Button, Card, Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const ProfileSection = styled(Card)``;

export const FieldTitle = styled(Text)`
  color: ${({ theme }) => theme.color.text.primary};
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const Field = styled.div``;

export const EditButton = styled(Button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
`;
