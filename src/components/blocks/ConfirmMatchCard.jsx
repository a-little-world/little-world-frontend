import {
  Button,
  ButtonTypes,
  Card,
  CardSizes,
  Text,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import { useTranslation } from "react-i18next";
import styled from "styled-components";

import ProfileImage from "../atoms/ProfileImage";

const ButtonsContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  ${({ theme }) => `
  gap: ${theme.spacing.small};
  flex-wrap: wrap;

  @media (min-width: ${theme.breakpoints.small}) {
    gap: ${theme.spacing.large};
    flex-wrap: nowrap;
  }
  `}
`;

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

const ConfirmMatchCard = ({ name, onConfirm, onExit, image, imageType }) => {
  const { t } = useTranslation();

  return (
    <Card width={CardSizes.Large}>
      <Centred>
        <Text tag="h2" type={TextTypes.Heading2}>
          {t("confirm_match_title")}
        </Text>

        <ProfileImage image={image} imageType={imageType} />
        <Text type={TextTypes.Body3}>{t("confirm_match_description", { name })}</Text>
        <Text tag="h3" type={TextTypes.Body3}>
          {t("confirm_match_instruction")}
        </Text>
      </Centred>

      <ButtonsContainer>
        <Button type="button" variation={ButtonTypes.Secondary} onClick={onExit}>
          {t("confrim_match_reject_btn")}
        </Button>
        <Button type="button" onClick={onConfirm}>
          {t("confirm_match_confirm_btn")}
        </Button>
      </ButtonsContainer>
    </Card>
  );
};

export default ConfirmMatchCard;
