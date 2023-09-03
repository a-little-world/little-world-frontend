import {
  Button,
  ButtonTypes,
  Card,
  CardSizes,
  Text,
  TextTypes,
} from "@a-little-world/little-world-design-system";
import React, { useState } from "react";
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

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => `
  margin-bottom: ${theme.spacing.large};

  @media (min-width: ${theme.breakpoints.small}) {
    margin-bottom: ${theme.spacing.xlarge};
  }
  `}
`;

const ConfirmMatchCard = ({ name, onConfirm, onExit, onReject, image, imageType }) => {
  const { t } = useTranslation();
  const [rejected, setRejected] = useState(false);

  const handleReject = () => {
    setRejected(true);
    onReject();
  };

  return (
    <Card width={CardSizes.Large}>
      {rejected ? (
        <>
          <Centred>
            <Text tag="h2" type={TextTypes.Heading2}>
              {t("rejected_match_title")}
            </Text>
          </Centred>
          <Centred>
            <Text bold type={TextTypes.Body3}>
              {t("rejected_match_description", { name })}
            </Text>
          </Centred>
          <InfoContainer>
            <Text type={TextTypes.Body3}>{t("rejected_match_info_1")}</Text>
            <Text type={TextTypes.Body3}>{t("rejected_match_info_2")}</Text>
            <Text type={TextTypes.Body3}>{t("rejected_match_info_3")}</Text>
          </InfoContainer>
          <Button type="button" variation={ButtonTypes.Secondary} onClick={onExit}>
            {t("rejected_match_btn")}
          </Button>
        </>
      ) : (
        <>
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
            <Button type="button" variation={ButtonTypes.Secondary} onClick={handleReject}>
              {t("confirm_match_reject_btn")}
            </Button>
            <Button type="button" onClick={onConfirm}>
              {t("confirm_match_confirm_btn")}
            </Button>
          </ButtonsContainer>
        </>
      )}
    </Card>
  );
};

export default ConfirmMatchCard;
