import {
  Button,
  Card,
  CardSizes,
  Text,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
import styled from "styled-components";

import ProfileImage from "../atoms/ProfileImage";

const Centred = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;

  ${({ theme }) => `
  margin-bottom: ${theme.spacing.medium};

  @media (min-width: ${theme.breakpoints.small}) {
    margin-bottom: ${theme.spacing.large};
  }
  `}
`;

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
`;

export const CircleImage = styled.div`
  border-radius: 50%;
  border: 8px solid #e6e8ec;
  background: ${({ $image }) => `url(${$image})`};
  background-size: cover;
  background-position: center;
  width: 154px;
  height: 154px;
  display: flex;
  align-items: end;
  justify-content: center;
  padding: 16px;
  position: relative;
`;

const NewMatchCard = ({ name, image, imageType, onExit }) => {
  const { t } = useTranslation();

  return (
    <Card width={CardSizes.Large}>
      <Centred>
        <Text tag="h2" type={TextTypes.Heading2}>
          {t("new_match_title")}
        </Text>

        <ProfileImage image={image} imageType={imageType} />
        <Text type={TextTypes.Body3}>{t("new_match_description", { name })}</Text>
        <Text tag="h3" type={TextTypes.Body3}>
          {t("new_match_instruction")}
        </Text>
      </Centred>
      <Button onClick={onExit}>{t("new_match_close_btn")}</Button>
    </Card>
  );
};

export default NewMatchCard;
