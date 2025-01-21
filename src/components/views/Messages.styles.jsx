import styled, { css } from 'styled-components';

// eslint-disable-next-line
export const ChatDashboard = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  overflow-y: scroll;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `}
`;
