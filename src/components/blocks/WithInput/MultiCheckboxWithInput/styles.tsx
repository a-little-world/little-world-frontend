import styled from 'styled-components';

// eslint-disable-next-line
export const Container = styled.div`
  > *:nth-child(2) {
    margin-left: ${({ theme }) => theme.spacing.xsmall};
    margin-top: ${({ theme }) => theme.spacing.xxxsmall};
  }
`;
