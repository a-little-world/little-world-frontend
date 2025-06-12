import { Link, Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const Description = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  gap: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;
  margin-bottom: ${({ theme }) => theme.spacing.small};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.large}) {
       margin-bottom: ${theme.spacing.small};
  }`}
`;

export const Image = styled.img<{ $withAdditionalImage?: boolean }>`
  max-width: 272px;
  max-height: ${({ $withAdditionalImage }) =>
    $withAdditionalImage ? '200px' : '56px'};
  margin: auto;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.large}) {
       max-width: 320px;
  }`}
`;

export const AdditionalImage = styled(Image)`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.large};
  width: 100%;
  object-fit: cover;
  max-width: 320px;
`;

export const Cta = styled(Link)`
  align-self: flex-start;
  margin-bottom: ${({ theme }) => theme.spacing.medium};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.large}) {
       margin-top: ${theme.spacing.xxsmall};
       margin-bottom: ${theme.spacing.large};
  }`}
`;
