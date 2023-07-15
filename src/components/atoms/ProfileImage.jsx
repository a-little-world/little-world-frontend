import Avatar from "react-nice-avatar";
import styled from "styled-components";

const StyledAvatar = styled(Avatar)`
  width: 180px;
  height: 180px;
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
  width: 180px;
  height: 180px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 16px;
  position: relative;
`;

function ProfileImage({ image, imageType }) {
  return imageType === "avatar" ? (
    <StyledAvatar {...image} />
  ) : (
    <CircleImage alt="user image" $image={image} />
  );
}

export default ProfileImage;
