import {
  Button,
  ButtonTypes,
  Card,
  CardSizes,
  Text,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import { useTranslation } from "react-i18next";
import Avatar from "react-nice-avatar";
// import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import "../i18n";

// import Link from "../path-prepend";
import "./overlay.css";

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 32px;
`;

const Centred = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: center;
  text-align: center;
  margin-bottom: 32px;
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

// const StyledImage = styled.img`
//   width: 100%;
//   height: 320px;
//   display: block;
//   border-radius: 20px;
//   object-fit: cover;
// `;

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

export function MatchConfirmOverlay({ name, avatar, onConfirm, onExit, image, imageType }) {
  const { t } = useTranslation();
  console.log({ name, image, imageType });
  return (
    <Card width={CardSizes.Large}>
      <Centred>
        <Text tag="h2" type={TextTypes.Heading2}>
          {t("confirm_match_title")}
        </Text>

        {imageType === "avatar" ? (
          <StyledAvatar {...avatar} />
        ) : (
          <CircleImage alt="match" $image={image} />
        )}
        <Text type={TextTypes.Body3}>{t("confirm_match_description", { name })}</Text>
        <Text tag="h3" type={TextTypes.Body3}>
          {t("confirm_match_instruction")}
        </Text>
      </Centred>

      <ButtonsContainer>
        <Button type="button" onClick={onConfirm}>
          {t("confirm_match_confirm_btn")}
        </Button>
        <Button type="button" variation={ButtonTypes.Secondary} onClick={onExit}>
          {t("confrim_match_reject_btn")}
        </Button>
      </ButtonsContainer>
    </Card>
  );
}
