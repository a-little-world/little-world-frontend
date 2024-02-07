import {
  Button,
  ImageSearchIcon,
} from '@a-little-world/little-world-design-system';
import styled from 'styled-components';

import ProfileImage, { ImageSizes } from '../../../atoms/ProfileImage';

export const ProfilePicWrapper = styled.div`
  position: relative;
`;

export const SelectionPanel = styled.div`
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

export const InteractiveArea = styled.div`
  background: ${({ theme }) => theme.color.surface.secondary};
  border-radius: 10px;
  cursor: pointer;
  padding: ${({ theme }) => theme.spacing.xsmall};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  flex-grow: 1;
  gap: ${({ theme }) => theme.spacing.xxsmall};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
    padding: ${theme.spacing.medium};
  }`}
`;

export const UploadArea = styled(InteractiveArea)`
  text-align: center;
  cursor: pointer;

  * {
    cursor: pointer;
  }
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

export const UploadLabel = styled.label`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
  gap: 10px;
  padding: 10px 20px;
  border-radius: 20px;
  background: #1a1a1a;

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

export const ColorPicker = styled.button`
  background: ${({ background }) => background};
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

export const StyledFileIcon = styled(ImageSearchIcon)`
  display: none;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      display: block;
      color: ${theme.color.surface.bold};
      margin-bottom: ${theme.spacing.xxsmall};
  }`}
`;
