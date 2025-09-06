import { Text } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const Container = styled.div`
  display: flex;
  flex-direction: column;
  //   transition: width ease 0.3s;
`;

export const TextArea = styled.textarea`
  position: relative;
  background: #f9f9f9;
  border-radius: 20px;
  padding: 10px;
  color: #a6a6a6;
  box-sizing: content-box;
`;

export const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const Buttons = styled.button``;

export const AddNoteButton = styled.button`
  background: linear-gradient(
    43.07deg,
    #db590b -3.02%,
    #f39325 93.96%
  ) !important;
  border-radius: 100px;
  padding: 8px 6px;
  font-size: 14px;
  min-width: 66px;
  color: #f9f9f9;
  font-weight: 600;
  display: ${props => (props.show ? 'block' : 'none')};
`;

export const WrapperContainer = styled.div`
  width: 100%;
`;

export const UpdatedAtLabel = styled.div`
  font-size: ${({ theme }) => `${theme.spacing.xsmall}`};
  color: #626262;
  padding-bottom: ${({ theme }) => `${theme.spacing.xxxsmall}`};
  padding-right: ${({ theme }) => `${theme.spacing.xsmall}`};
  align-self: end;
`;

export const QuestionActions = styled.div`
  height: ${({ theme }) => `${theme.spacing.medium}`};
  margin-top: ${({ theme }) => `${theme.spacing.xxxsmall}`};
  display: flex;
  gap: ${({ theme }) => `${theme.spacing.xxxsmall}`};
`;

export const QuestionActionsWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
`;

export const CategoryButton = styled.button<{ selected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.xxsmall}`};
  border-radius: ${({ theme }) => `${theme.spacing.medium}`};
  font-style: normal;
  font-weight: 500;
  font-size: ${({ theme }) => `${theme.spacing.small}`};
  white-space: nowrap;
  border: 2px solid #ef8a21;
  margin: 0 4px;
  box-sizing: border-box;
  display: flex;

  ${({ selected }) =>
    selected &&
    `
      background: linear-gradient(43.07deg, #db590b -3.02%, #f39325 93.96%);
      color: white;
      `};
`;

export const StyledImage = styled.img<{ selected: boolean }>`
  height: 20px;
  width: 20px;
  ${({ selected }) => selected && ` filter: brightness(0) invert(1); `}
`;

export const EditButton = styled.button`
  background: linear-gradient(
    43.07deg,
    #db590b -3.02%,
    #f39325 93.96%
  ) !important;
  border-radius: 100px;
  font-size: 14px;
  min-width: ${({ theme }) => `${theme.spacing.xxlarge}`};
  color: #f9f9f9;
  font-weight: 600;
  height: ${({ theme }) => `${theme.spacing.medium}`};
`;

export const NoteCardTextArea = styled.textarea`
  border: none;
  background: #f9fafb;
  outline: none;

  &:focus {
    outline: none;
    border: none;
  }

  &:focus:not(:focus-visible) {
    outline: none;
    border: none;
  }
`;

export const NotesCardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex-grow: 1;
`;

export const NotesCard = styled.div<{ selected: boolean }>`
  border: 1px solid rgb(0 0 0 / 5%);
  box-sizing: border-box;
  border-radius: ${({ theme }) => `${theme.spacing.small}`};
  margin-top: ${({ theme }) => `${theme.spacing.xsmall}`};
  background: #f9fafb;
  width: 100%;
  display: block;
  display: flex;
  flex-direction: column;
  align-items: center;

  ${({ selected }) =>
    selected &&
    `
      border-color: red;
    `}
`;

export const CardButton = styled.button<{ selected: boolean }>`
  padding: ${({ theme }) => `${theme.spacing.small}`};
  font-size: unset;
  width: 100%;
  border-radius: inherit;
  text-align: left;
  ${({ selected }) => selected && `  padding: 0; `}
`;

export const CategoryWrapper = styled.div`
  display: flex;
  overflow-x: hidden;
  padding: 2px;
  margin-bottom: ${({ theme }) => `${theme.spacing.xxsmall}`};
`;
export const SidebarSelector = styled.div`
  display: flex;
  justify-content: center;
  gap: ${({ theme }) => `${theme.spacing.xxxsmall}`};
`;

export const SidebarWrapper = styled.aside<{ $isDisplayed: boolean }>`
  width: 33.33%; // fallback for browsers that don't support calc
  width: calc(100% / 3);
  display: none;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  border: 2px solid ${({ theme }) => theme.color.border.subtle};
  box-shadow: 1px 2px 5px rgb(0 0 0 / 7%);
  background: ${({ theme }) => theme.color.surface.primary};
  border-radius: ${({ theme }) => theme.radius.large};
  box-sizing: border-box;
  padding: ${({ theme }) => theme.spacing.small};
  flex-shrink: 0;

  ${({ theme, $isDisplayed }) => css`
    @media (min-width: ${theme.breakpoints.large}) {
      display: ${$isDisplayed ? 'flex' : 'none'};
    }
  `}
`;

export const SidebarContent = styled.div`
  flex-grow: 1;
  overflow: auto;
  height: 100px;
  display: flex;
`;

export const CategoryLabel = styled(Text)<{ $desktopOnly: boolean }>`
  ${({ theme, $desktopOnly }) =>
    $desktopOnly &&
    css`
      display: none;
      @media (min-width: ${theme.breakpoints.medium}) {
        display: block;
      }
    `}
`;
