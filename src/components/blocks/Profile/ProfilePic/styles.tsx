import { Button } from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

import { INTERACTIVE_AREA_CSS } from '../../FileDropzone/FileDropzone.styles';

export const ProfilePicWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      gap: ${theme.spacing.small};
    }`}
`;

export const SelectionPanel = styled.div<{
  $selected?: boolean;
  $error?: boolean;
}>`
  position: relative;
  border: 2.5px solid;
  border-color: ${({ $selected, theme, $error }) =>
    $selected
      ? $error
        ? theme.color.border.error
        : theme.color.border.selected
      : theme.color.border.subtle};
  border-radius: 20px;
  cursor: pointer;
  display: flex;
  align-items: stretch;
  justify-content: center;
  gap: ${({ theme }) => theme.spacing.small};
  padding: ${({ theme }) => theme.spacing.xxsmall};
  flex-wrap: wrap;
  overflow: hidden;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
        flex-wrap: nowrap;
        padding: ${theme.spacing.medium};
      }`}
`;

export const ImageContainer = styled.div`
  display: none;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
        display: flex;
        align-items: center;
      }`}
`;

export const InteractiveArea = styled.div`
  ${INTERACTIVE_AREA_CSS}

  padding: ${({ theme }) => theme.spacing.xsmall};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      padding: ${theme.spacing.medium};
    }`}
`;

export const AvatarSelection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const RadioInput = styled.input`
  margin: auto 0.4rem auto auto;
`;

export const Editor = styled.div`
  padding: 20px;
  background: #101010;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 20px;
  gap: 20px;
`;

export const AvatarContainer = styled.div`
  height: 200px;
  width: 200px;
  background: #222;
  border-radius: 100%;
`;

export const Controls = styled.div`
  display: flex;
  gap: 24px 10px;
  padding: 10px 20px;
  border-radius: 20px;
  background: #1a1a1a;
  justify-content: center;

  flex-wrap: wrap;

  .color {
    background: rgb(136, 204, 136);
    color: black;
  }

  div .label {
    user-select: none;
  }

  div span.color {
    top: 0%;
    position: absolute;
    padding: 2px;
    background: ${({ theme }) => theme.color.surface.primary};
    font-size: 14px;
    color: #111;
    border-radius: 10px;
    opacity: 0;
    transition: 0.2s ease-in-out;
  }

  div:hover span.color {
    top: -60%;
    opacity: 1;
  }
`;

export const ControlColumn = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: center;

  &:not(last-of-type) {
    padding-right: ${({ theme }) => theme.spacing.xxsmall};
    border-right: 1px solid #3c3c3c;
  }

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.small}) {
          flex-direction: column;
      }`}
`;

export const OptionToggle = styled.button`
    display: flex;
    align-items:
    height: 35px;
    border-radius: 15px;
    color: #bbb;
    background: #3c3c3c;
    padding: ${({ theme }) => theme.spacing.xxsmall};
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    position: relative;
  
    &:hover {
      color: #fff;
    }
  `;

export const ColorPicker = styled.button<{ $background: string }>`
  background: ${({ $background }) => $background};
  height: 32px;
  width: 32px;
  border: 1px solid white;
  border-radius: 50%;
`;

export const Buttons = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const AvatarEditorButton = styled(Button)`
  padding: 0 ${({ theme }) => theme.spacing.xxxsmall};
  border-radius: 5px;
`;
