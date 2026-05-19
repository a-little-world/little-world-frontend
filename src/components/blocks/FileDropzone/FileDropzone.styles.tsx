import {
  ImageSearchIcon,
  Text,
} from '@a-little-world/little-world-design-system';
import styled, { css } from 'styled-components';

export const DropZoneContainer = styled.div`
  width: 100%;
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

export const UploadArea = styled.label<{
  $dragging?: boolean;
}>`
  ${INTERACTIVE_AREA_CSS}
  cursor: pointer;
  gap: ${({ theme }) => theme.spacing.xxxsmall};
  padding: ${({ theme }) => theme.spacing.xsmall};
  text-align: center;

  * {
    cursor: pointer;
  }

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
          padding: ${theme.spacing.large};
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

export const ContactLink = styled.a`
  display: flex;
  text-align: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  align-items: center;
`;

export const FileName = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  color: ${({ theme }) => theme.color.text.accent};
`;

export const FileText = styled(Text)`
  color: ${({ theme }) => theme.color.text.accent};
  margin-top: ${({ theme }) => theme.spacing.xxxsmall};
`;

export const DesktopUploadIcon = styled(ImageSearchIcon)`
  display: none;

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      display: block;
      color: ${theme.color.surface.bold};
      margin-bottom: ${theme.spacing.xxsmall};
    }`}
`;
