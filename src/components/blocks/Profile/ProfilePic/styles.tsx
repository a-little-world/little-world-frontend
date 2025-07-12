import { Button } from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

import ProfileImage, { ImageSizes } from '../../../atoms/ProfileImage';

export const ProfilePicWrapper = styled.div`
  position: relative;
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

  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      flex-wrap: nowrap;
      padding: ${theme.spacing.medium};
      margin-bottom: ${theme.spacing.small};
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

export const INTERACTIVE_AREA_CSS = css`
  background: ${({ theme }) => theme.color.surface.secondary};
  border: 1px solid ${({ theme }) => theme.color.border.subtle};
  border-radius: 10px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

export const InteractiveArea = styled.div`
  ${INTERACTIVE_AREA_CSS}

  padding: ${({ theme }) => theme.spacing.xsmall};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
    padding: ${theme.spacing.medium};
  }`}
`;

export const UploadArea = styled.label<{
  $dragging?: boolean;
  $padding?: string;
}>`
  ${INTERACTIVE_AREA_CSS}
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  padding: ${({ theme, $padding }) => $padding || theme.spacing.xsmall};
  text-align: center;

  * {
    cursor: pointer;
  }

  ${({ theme, $padding }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      padding: ${$padding || theme.spacing.medium};
  }`}

  ${({ $dragging }) =>
    $dragging &&
    css`
      border-style: dashed;
      filter: contrast(105%);

      * {
        pointer-events: none;
      }
    `}
`;

export const StyledProfileImage = styled(ProfileImage)`
  width: ${ImageSizes.small};
  height: ${ImageSizes.small};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
    width: ${ImageSizes.medium};
    height: ${ImageSizes.medium};
  }`}
`;

export const CircleButton = styled(Button)`
  border-radius: 50%;
  border: 3px solid ${({ theme }) => theme.color.surface.bold};
  background: ${({ theme }) => theme.color.surface.primary};

  width: ${ImageSizes.small};
  height: ${ImageSizes.small};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
    width: ${ImageSizes.medium};
    height: ${ImageSizes.medium};
  }`}
`;

export const TrashButton = styled(Button)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.large};
`;

export const AvatarSelection = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.spacing.small};
  align-items: center;
  justify-content: space-between;
  width: 100%;
`;

export const FileInput = styled.input`
  visibility: hidden;
  position: absolute;

  &::-webkit-file-upload-button {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    position: absolute;
    opacity: 0;
  }
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
    border-radius: 4px;
  }
`;

export const ControlGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
`;

export const ControlLabel = styled.div`
  font-size: 12px;
  color: #ccc;
  text-align: center;
`;

export const ColorPicker = styled.input`
  width: 40px;
  height: 40px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  background: none;
`;

export const Slider = styled.input`
  width: 100px;
  height: 6px;
  border-radius: 3px;
  background: #333;
  outline: none;
  -webkit-appearance: none;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: #fff;
    cursor: pointer;
    border: none;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
`;

export const SaveButton = styled(Button)`
  background: #4caf50;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #45a049;
  }
`;

export const CancelButton = styled(Button)`
  background: #f44336;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;

  &:hover {
    background: #da190b;
  }
`;
