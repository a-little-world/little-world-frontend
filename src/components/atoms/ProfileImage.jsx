import React from "react";
import Avatar from "react-nice-avatar";
import styled from "styled-components";

const ImageSizes = {
  small: "120px",
  medium: "154px",
  large: "180px",
};

const StyledAvatar = styled(Avatar)`
  width: ${({ $size }) => ImageSizes[$size]};
  height: ${({ $size }) => ImageSizes[$size]};
  display: block;
  border-radius: 20px;
  object-fit: cover;
  border: 8px solid #e6e8ec;
  filter: drop-shadow(0px 4px 4px rgb(0 0 0 / 25%));
  border-radius: 100%;
  box-sizing: border-box;
  text-align: initial;
`;

export const CircleImage = styled.div`
  border-radius: 50%;
  border: 8px solid #e6e8ec;
  background: ${({ $image }) => `url(${$image})`};
  background-size: cover;
  background-position: center;
  width: ${({ $size }) => ImageSizes[$size]};
  height: ${({ $size }) => ImageSizes[$size]};
  display: flex;
  align-items: end;
  justify-content: center;
  padding: ${({ theme }) => theme.spacing.small};
  position: relative;
`;

export const Image = styled.img`
  background: ${({ $image }) => `url(${$image})`};
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

  ${({ theme }) =>
    `@media (min-width: ${theme.breakpoints.small}) {
      height: ${({ $size }) => ImageSizes[$size]};;
    }`}
`;

function ProfileImage({ children, image, imageType, circle, size = "large" }) {
  if (imageType === "avatar") return <StyledAvatar {...image} $size={size} />;
  return circle ? (
    <CircleImage alt="user image" $image={image} $size={size}>
      {children}
    </CircleImage>
  ) : (
    <Image alt="user image" src={image} $size={size} />
  );
}

export default ProfileImage;
