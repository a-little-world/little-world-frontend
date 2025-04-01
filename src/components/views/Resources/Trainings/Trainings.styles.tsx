import { Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const CheckInText = styled(Text)`
  margin-top: ${({ theme }) => theme.spacing.xsmall};
  span {
    font-size: 1.125rem;
  }
`;

export const Method = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;
