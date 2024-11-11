import {
  Button,
  ButtonAppearance,
  Card,
  CardHeader,
  CardSizes,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { CardContent } from '@a-little-world/little-world-design-system/dist/esm/components/Card/Card';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { setMatchRejected } from '../../../features/userData';
import { useSelector } from '../../../hooks/index.ts';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import ProfileImage from '../../atoms/ProfileImage';
import { TextField } from '../Profile/styles';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => `
  margin-bottom: ${theme.spacing.xxsmall};

  @media (min-width: ${theme.breakpoints.small}) {
    margin-bottom: ${theme.spacing.small};
  }
  `}
`;

const ProfileInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xxsmall};
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
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
  const dispatch = useDispatch();
  const matchRejected = useSelector(state => state.userData.matchRejected);

  const handleReject = () => {
    onReject();
    dispatch(setMatchRejected(true));
  };

  return (
    <Card width={CardSizes.Medium}>
      {matchRejected ? (
        <>
          <CardHeader>{t('rejected_match_title')}</CardHeader>
          <Text bold type={TextTypes.Body5} center>
            {t('rejected_match_description', { name })}
          </Text>

          <InfoContainer>
            <Text type={TextTypes.Body5}>{t('rejected_match_info_1')}</Text>
            <Text type={TextTypes.Body5}>{t('rejected_match_info_2')}</Text>
            <Text type={TextTypes.Body5}>{t('rejected_match_info_3')}</Text>
          </InfoContainer>
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
          <CardContent $align="center" $marginBottom="24px">
            <div>
              <ProfileImage image={image} imageType={imageType} />
            </div>
            <ProfileInfo>
              <Text tag="h3" bold type={TextTypes.Heading5} center>
                {name}
              </Text>
              <TextField>{description}</TextField>
            </ProfileInfo>
            <Text type={TextTypes.Body5}>
              {t('confirm_match_description', { name })}
            </Text>
            <Text tag="h3" type={TextTypes.Body5}>
              {t('confirm_match_instruction', { name })}
            </Text>
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
