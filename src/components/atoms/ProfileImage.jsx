import React from 'react';
import Avatar from 'react-nice-avatar';
import styled from 'styled-components';

import { shimmer, shimmerGradient } from './Loading.tsx';

export const ImageSizes = {
  xsmall: '72px',
  small: '128px',
  medium: '154px',
  large: '180px',
  flex: '100%',
};

const BorderSizes = {
  xsmall: '4px',
  small: '8px',
  medium: '8px',
  large: '8px',
  flex: '4px',
};

const StyledAvatar = styled(Avatar)`
  width: auto;
  height: ${({ $size }) => ImageSizes[$size]};
  max-height: ${ImageSizes.large};
  max-width: ${ImageSizes.large};
  display: block;
  object-fit: cover;
  border: ${({ $size }) => BorderSizes[$size]} solid #e6e8ec;
  filter: drop-shadow(0px 4px 4px rgb(0 0 0 / 25%));
  border-radius: 100%;
  box-sizing: border-box;
  text-align: initial;
  background-clip: padding-box;
  transform: translateZ(0);
  aspect-ratio: 1;
`;

export const CircleImage = styled.div`
  border-radius: 50%;
  border: ${({ $size }) => BorderSizes[$size]} solid #e6e8ec;
  background: ${({ $image }) => `url(${$image})`};
  background-size: cover;
  background-position: center;
  width: ${({ $size }) => ($size === 'flex' ? 'auto' : ImageSizes[$size])};
  height: ${({ $size }) => ImageSizes[$size]};
  max-height: ${ImageSizes.large};
  max-width: ${ImageSizes.large};
  display: flex;
  align-items: end;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.small};
  position: relative;
  aspect-ratio: 1;
`;

export const CircleImageLoading = styled(CircleImage)`
  background: ${shimmerGradient};
  background-size: 200% 100%;
  animation: ${shimmer} 1.5s infinite reverse;
  flex-shrink: 0;
`;

export const Image = styled.img`
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: end;
  justify-content: center;
  width: 100%;
  max-width: 400px;
  height: ${({ $size }) => ImageSizes[$size]};
  border-radius: 30px;
  object-fit: cover;

  ${({ theme, $size }) =>
    `@media (min-width: ${theme.breakpoints.small}) {
      height: ${ImageSizes[$size]};
    }`}
`;

function ProfileImage({
  children,
  className,
  image,
  imageType,
  circle,
  size = 'large',
}) {
  if (imageType === 'avatar')
    return <StyledAvatar className={className} {...image} $size={size} />;
  return circle ? (
    <CircleImage
      className={className}
      alt="user image"
      $image={image}
      $size={size}
    >
      {children}
    </CircleImage>
  ) : (
    <Image className={className} alt="user image" src={image} $size={size} />
  );
}

export default ProfileImage;
