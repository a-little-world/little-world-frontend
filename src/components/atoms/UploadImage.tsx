import React from 'react';

import {
  Button,
  ButtonVariations,
  TrashIcon,
} from '@a-little-world/little-world-design-system';
import styled, { css, useTheme } from 'styled-components';

import ProfileImage, { ImageSizes } from './ProfileImage';

const StyledProfileImage = styled(ProfileImage)`
  width: ${ImageSizes.small};
  height: ${ImageSizes.small};

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.medium}) {
      width: ${ImageSizes.medium};
      height: ${ImageSizes.medium};
    }`}
`;

const CircleButton = styled(Button)`
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

const TrashButton = styled(Button)`
  position: absolute;
  bottom: ${({ theme }) => theme.spacing.large};
`;

export interface UploadImageProps {
  className?: string;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  icon: React.ReactNode;
  onImageDelete?: (e: React.MouseEvent) => void;
  uploadedImage?: string | null;
}

const UploadImage: React.FC<UploadImageProps> = ({
  className,
  fileInputRef,
  icon,
  onImageDelete,
  uploadedImage,
}) => {
  const theme = useTheme();

  return uploadedImage ? (
    <StyledProfileImage
      className={className}
      image={uploadedImage}
      imageType="image"
      size="medium"
      circle
    >
      {onImageDelete && (
        <TrashButton
          onClick={onImageDelete}
          variation={ButtonVariations.Icon}
          type="button"
        >
          <TrashIcon
            label="delete image"
            color={theme.color.surface.disabled}
          />
        </TrashButton>
      )}
    </StyledProfileImage>
  ) : (
    <CircleButton
      className={className}
      onClick={() => fileInputRef.current?.click()}
      type="button"
    >
      {icon}
    </CircleButton>
  );
};

export const MobileUploadImage = styled(UploadImage)`
  ${({ theme }) => css`
    display: flex;
    margin-bottom: ${theme.spacing.xsmall};

    @media (min-width: ${theme.breakpoints.medium}) {
      display: none;
    }
  `}
`;

export default UploadImage;
