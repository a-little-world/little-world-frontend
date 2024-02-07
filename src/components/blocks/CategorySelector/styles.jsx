import { Text } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const CategorySelectorWrapper = styled.div`
  display: flex;
  align-items: stretch;
  gap: ${({ theme }) => theme.spacing.small};
  flex-wrap: wrap;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.small}) {
      flex-wrap: nowrap;
      gap: ${theme.spacing.xlarge};
    }`}
`;

export const SelectionPanel = styled.button`
  border: 2.5px solid;
  border-color: ${({ $selected }) => ($selected ? '#f39325' : '#E6E8EC')};
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.small};
  box-shadow: 2px 2px 7px 0px #0000001f;
  width: 100%;
  flex-basis: 100%;
  transition: box-shadow 0.25s, transform 0.25s;

  > svg {
    width: 80px;
    height: 80px;
  }

  &:hover {
    transform: scale(1.015);
    box-shadow: 0 1px 10px 0 rgb(0 0 0/20%);
    filter: none !important;
  }

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.small}) {
      padding: ${theme.spacing.large};
      width: unset;
      flex-basis: 50%;
      flex-direction: column;
      height: 100%;

      > svg {
        width: 150px;
        height: 150px;
      }
    }`}
`;

export const TextSection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1;
  gap: ${({ theme }) => theme.spacing.small};
`;

export const CategoryNote = styled(Text)`
  margin-top: auto;
`;
