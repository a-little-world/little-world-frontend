import { Card, Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  flex-grow: 1;
`;

export const StyledCard = styled(Card)`
  position: relative;
  min-height: 591px;
  width: 100%;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.small}) {
      max-width: 760px;
    }`}
`;

export const FormButtons = styled.div`
  display: flex;
  align-items: center;
  justify-content: ${({ $onlyOneBtn }) =>
    $onlyOneBtn ? 'flex-end' : 'space-between'};
  width: 100%;
  margin-top: auto;
  gap: ${({ theme }) => theme.spacing.large};
  flex-wrap: wrap;

  > button {
    flex: 1;
  }

  ${({ theme }) =>
  `@media (min-width: ${theme.breakpoints.small}) {
    > button {
      flex: unset;
    }
  }`}

`;

export const SubmitError = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: ${({ theme }) => theme.spacing.xlarge};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  opacity: ${({ $visible }) => ($visible ? 1 : 0)};
  transition: ${({ $visible }) => ($visible ? 'opacity 1s' : 'none')};
  text-align: center;

  background: ${({ theme }) => theme.color.surface.error};
  color: ${({ theme }) => theme.color.text.error};
`;

export const Title = styled(Text)`
  text-align: center;
  color: ${({ theme }) => theme.color.text.highlight};
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;
