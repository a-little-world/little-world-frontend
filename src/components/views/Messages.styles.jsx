import styled, { css } from 'styled-components';

// eslint-disable-next-line
export const ChatDashboard = styled.div`
  position: relative;
  display: flex;
  flex: 1;
  width: 100%;
  height: 100%;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  overflow: hidden;

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      padding: 0;
    }
  `}
`;
