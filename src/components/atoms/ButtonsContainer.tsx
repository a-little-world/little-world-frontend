import styled from 'styled-components';

const ButtonsContainer = styled.div<{
  $marginTop?: string;
  $maxWidth?: string;
}>`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;

  ${({ theme, $maxWidth, $marginTop }) => `
    gap: ${theme.spacing.medium};
    flex-wrap: wrap;
    margin-top: ${$marginTop || '0'};

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
      max-width: ${$maxWidth || '500px'};

      > button,
      > a {
        flex: 1;
      }
    }
  `}
`;

export default ButtonsContainer;
