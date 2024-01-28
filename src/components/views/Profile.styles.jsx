import { Button, Card, Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const Details = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
`;

export const ProfileSection = styled(Card)`
  position: relative;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: 30px;
  border-color: ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  min-height: 136px;
  justify-content: space-between;
`;

export const FieldTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

export const Field = styled.div``;

export const EditButton = styled(Button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.color.surface.bold};
`;
