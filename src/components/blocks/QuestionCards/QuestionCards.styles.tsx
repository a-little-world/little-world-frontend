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

export const TopicButton = styled.button<{ $selected: boolean }>`
  font-size: 1rem;
  font-weight: normal;
  min-width: fit-content;
  padding: ${({ theme }) => theme.spacing.xsmall};
  border-radius: 23px;
  font-style: normal;
  font-weight: 500;
  font-size: 18px;
  white-space: nowrap;
  border: 2px solid #ef8a21;
  margin: 0px ${({ theme }) => theme.spacing.xxxsmall};
  box-sizing: border-box;

  ${({ $selected }) =>
    $selected
    && `
    background: linear-gradient(43.07deg, #db590b -3.02%, #f39325 93.96%);
    color: white;
  `}
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
    $selected
    && `
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
  overflow-x: hidden;
  padding: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const QuestionCategories = styled.div`
  display: flex;
  align-items: center;
`;

export const CategoryControl = styled(Button)`
  flex-shrink: 0;
`;
