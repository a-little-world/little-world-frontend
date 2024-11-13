import styled from 'styled-components';

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${({ theme }) => `
    gap: ${theme.spacing.small};
    flex-wrap: wrap;

    @media (max-width: ${theme.breakpoints.small}) {
      > button,
      > a {
        width: 100%;
      }
      > *:first-child {
        order: 1;
      }
    }

    @media (min-width: ${theme.breakpoints.small}) {
      gap: ${theme.spacing.large};
      flex-wrap: nowrap;

      > button,
      > a {
        flex: 1;
      }
    }
  `}
`;

export default ButtonsContainer;
