import styled from 'styled-components';

export const Container = styled.div`
  > *:nth-child(2) {
    margin-left: ${({ theme }) => theme.spacing.xsmall};
  }
`;
