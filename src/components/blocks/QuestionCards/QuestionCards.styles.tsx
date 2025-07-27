import { Button, Card } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

export const SidebarCard = styled(Card)`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: transparent;
  border: none;
  box-shadow: none;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};
`;

export const TopicButton = styled(Button)`
  white-space: nowrap;
  margin: 0px ${({ theme }) => theme.spacing.xxxsmall};
  min-width: unset; // fallback
  min-width: fit-content;
`;

export const QuestionCard = styled.div<{ $selected: boolean }>`
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: ${({ theme }) => theme.radius.medium};
  background: ${({ theme }) => theme.color.surface.primary};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  align-items: center;

  ${({ $selected, theme }) =>
    $selected &&
    `
    border-color: ${theme.color.border.selected};
  `}
`;

export const QuestionContentCard = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  background: transparent;
  border: none;
  box-shadow: none;
  overflow: scroll;
  gap: ${({ theme }) => theme.spacing.xsmall};

  @media (min-width: ${({ theme }) => theme.breakpoints.small}) {
    padding-bottom: ${({ theme }) => theme.spacing.small};
  }
`;

export const QuestionButton = styled(Button)`
  padding: 0px;
  background: transparent;
  color: black;
  padding: ${({ theme }) => theme.spacing.xxsmall};
  height: fit-content;
  font-weight: normal;
`;

export const Categories = styled.div`
  display: flex;
  overflow-x: scroll;
  padding: ${({ theme }) => theme.spacing.xxxsmall};
  flex: 1;
  height: calc(
    49px + ${({ theme }) => theme.spacing.xxsmall}
  ); // height of button + padding
`;

export const QuestionCategories = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

export const CategoryControl = styled(Button)`
  flex-shrink: 0;
`;
