import styled, { css } from 'styled-components';

export const Page = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.medium};
    }
  `};
`;

export const CardWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.small};
`;

export const LoadingWrap = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  padding: ${({ theme }) => theme.spacing.large};
`;
