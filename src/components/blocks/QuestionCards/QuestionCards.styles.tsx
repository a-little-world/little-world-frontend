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
  box-sizing: border-box;
  border-radius: 18px;
  background: ${({ theme }) => theme.color.surface.primary};
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
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

  @media (min-width: 500px) {
    padding: 0px 0px ${({ theme }) => theme.spacing.small};
  }
`;

export const QuestionButton = styled(Button)`
  padding: 0px;
  background: transparent;
  color: black;
  padding: ${({ theme }) => theme.spacing.xsmall};
  height: fit-content;
  font-size: 16px;
  font-weight: normal;
`;

export const ArchiveButton = styled.div`
  margin-top: ${({ theme }) => theme.spacing.xxxsmall};
  padding: 0px ${({ theme }) => theme.spacing.xsmall};
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
