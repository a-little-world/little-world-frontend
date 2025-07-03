import {
  Button,
  ButtonAppearance,
  Card,
  CardContent,
  CardHeader,
  CardSizes,
  Text,
  TextArea,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import ButtonsContainer from '../../atoms/ButtonsContainer';
import ProfileImage from '../../atoms/ProfileImage';
import { TextField } from '../Profile/styles';

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
  align-items: center;
  text-align: left;
`;

interface ConfirmaMatchCardProps {
  description: string;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  image: any;
  imageType: string;
}

const ConfirmMatchCard = ({
  description,
  name,
  onConfirm,
  onReject,
  onClose,
  image,
  imageType,
}: ConfirmaMatchCardProps) => {
  const { t } = useTranslation();
  const matchRejected = null; // TODO useSelector(state => state.userData.matchRejected);
  const theme = useTheme();

  const handleReject = () => {
    onReject();
    // dispatch(setMatchRejected(true)); TODO
  };

  return (
    <Card width={CardSizes.Medium}>
      {matchRejected ? (
        <>
          <CardHeader textColor={theme.color.text.title}>
            {t('rejected_match_title')}
          </CardHeader>
          <CardContent $align="flex-start">
            <Text bold type={TextTypes.Body5}>
              {t('rejected_match_description', { name })}
            </Text>
            <Text type={TextTypes.Body5}>{t('rejected_match_info_1')}</Text>
            <Text type={TextTypes.Body5}>{t('rejected_match_info_2')}</Text>
            <Text type={TextTypes.Body5}>{t('rejected_match_info_3')}</Text>
          </CardContent>
          <Button
            type="button"
            appearance={ButtonAppearance.Secondary}
            onClick={onClose}
          >
            {t('rejected_match_btn')}
          </Button>
        </>
      ) : (
        <>
          <CardHeader>{t('confirm_match_title')}</CardHeader>
          <CardContent
            $align="center"
            $textAlign="center"
            $marginBottom={theme.spacing.large}
          >
            <ProfileInfo>
              <ProfileImage image={image} imageType={imageType} />
              <Text tag="h3" bold type={TextTypes.Heading5} center>
                {name}
              </Text>
              <TextField>{description}</TextField>
            </ProfileInfo>
            <Text type={TextTypes.Body5}>
              {t('confirm_match_description', { name })}
            </Text>
            <Text type={TextTypes.Body5}>
              {t('confirm_match_instruction', { name })}
            </Text>
            <TextArea />
          </CardContent>

          <ButtonsContainer>
            <Button
              type="button"
              appearance={ButtonAppearance.Secondary}
              onClick={handleReject}
            >
              {t('confirm_match_reject_btn')}
            </Button>
            <Button type="button" onClick={onConfirm}>
              {t('confirm_match_confirm_btn')}
            </Button>
          </ButtonsContainer>
        </>
      )}
    </Card>
  );
};

export default ConfirmMatchCard;
