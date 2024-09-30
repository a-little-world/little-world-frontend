import {
  Button,
  ButtonAppearance,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useDispatch } from 'react-redux';
import styled from 'styled-components';

import { setMatchRejected } from '../../../features/userData';
import { useSelector } from '../../../hooks/index.ts';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import ProfileImage from '../../atoms/ProfileImage';
import ModalCard, { Centred } from './ModalCard';

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;

  ${({ theme }) => `
  margin-bottom: ${theme.spacing.xxsmall};

  @media (min-width: ${theme.breakpoints.small}) {
    margin-bottom: ${theme.spacing.small};
  }
  `}
`;

interface ConfirmaMatchCardProps {
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  onReject: () => void;
  image: any;
  imageType: string;
}

const ConfirmMatchCard = ({
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
    <ModalCard>
      {matchRejected ? (
        <>
          <Centred>
            <Text tag="h2" type={TextTypes.Heading4}>
              {t('rejected_match_title')}
            </Text>
          </Centred>
          <Centred>
            <Text bold type={TextTypes.Body5}>
              {t('rejected_match_description', { name })}
            </Text>
          </Centred>
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
          <Centred>
            <Text tag="h2" type={TextTypes.Heading4}>
              {t('confirm_match_title')}
            </Text>
            <div>
              <ProfileImage image={image} imageType={imageType} />
            </div>
            <Text type={TextTypes.Body5}>
              {t('confirm_match_description', { name })}
            </Text>
            <Text tag="h3" type={TextTypes.Body5}>
              {t('confirm_match_instruction', { name })}
            </Text>
          </Centred>

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
    </ModalCard>
  );
};

export default ConfirmMatchCard;
