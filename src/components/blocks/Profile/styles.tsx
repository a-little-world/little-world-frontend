import { Button, Card, Text } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const PageContent = styled.section`
  display: flex;
  flex-direction: column-reverse;
  gap: ${({ theme }) => theme.spacing.medium};
  align-items: center;
  padding: ${({ theme }) => theme.spacing.small};
  width: 100%;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
    @media (min-width: ${theme.breakpoints.large}) {
      align-items: flex-start;
      flex-direction: row;
    }
  `};
`;

export const TextField = styled.div`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 10px;
  background: ${({ theme }) => theme.color.surface.disabled};
  padding: ${({ theme }) => theme.spacing.small};
  white-space: pre-line;
`;

export const Details = styled.div`
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.medium};
  width: 100%;
  min-width: 0;
`;

export const ProfileSection = styled(Card)`
  position: relative;
  padding: ${({ theme }) => theme.spacing.medium};
  border-radius: ${({ theme }) => theme.radius.xlarge};
  border-color: ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  min-height: 136px;
  justify-content: space-between;
`;

export const FieldTitle = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xsmall};
`;

export const Field = styled.div``;

export const EditButton = styled(Button)`
  position: absolute;
  top: ${({ theme }) => theme.spacing.small};
  right: ${({ theme }) => theme.spacing.small};
  color: ${({ theme }) => theme.color.surface.bold};
`;

export const Description = styled(Text)`
  ${({ theme }) => css`
    margin-bottom: ${theme.spacing.small};
    @media (min-width: ${theme.breakpoints.xlarge}) {
      margin-bottom: ${theme.spacing.medium};
    }
  `};
`;
