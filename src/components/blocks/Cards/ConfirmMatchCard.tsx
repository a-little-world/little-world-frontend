import {
  Button,
  ButtonAppearance,
  Card,
  CardContent,
  CardHeader,
  CardSizes,
  Text,
  TextArea,
  TextAreaSize,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
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

const RejectReasonContainer = styled.div`
  margin-top: ${({ theme }) => theme.spacing.small};
  width: 100%;
`;

interface ConfirmaMatchCardProps {
  description: string;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  onReject: (reason?: string) => void;
  image: any;
  imageType: string;
}

interface RejectFormData {
  rejectReason: string;
}

type ViewState = 'confirm' | 'reject-form' | 'reject-confirmation';

interface ConfirmMatchProps {
  name: string;
  description: string;
  image: any;
  imageType: string;
  onConfirm: () => void;
  onRejectClick: () => void;
}

interface RejectMatchProps {
  name: string;
  image: any;
  imageType: string;
  onCancel: () => void;
  onSubmit: (data: RejectFormData) => void;
  errors: any;
  register: any;
  handleSubmit: any;
}

interface RejectConfirmationProps {
  name: string;
  onClose: () => void;
}

const ConfirmMatch: React.FC<ConfirmMatchProps> = ({
  name,
  description,
  image,
  imageType,
  onConfirm,
  onRejectClick,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <CardHeader>{t('confirm_match.title')}</CardHeader>
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
          {t('confirm_match.description', { name })}
        </Text>
        <Text type={TextTypes.Body5}>
          {t('confirm_match.instruction', { name })}
        </Text>
      </CardContent>

      <ButtonsContainer>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={onRejectClick}
        >
          {t('confirm_match.reject_button')}
        </Button>
        <Button type="button" onClick={onConfirm}>
          {t('confirm_match.confirm_button')}
        </Button>
      </ButtonsContainer>
    </>
  );
};

const RejectMatch: React.FC<RejectMatchProps> = ({
  name,
  image,
  imageType,
  onCancel,
  onSubmit,
  errors,
  register,
  handleSubmit,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <CardHeader>{t('confirm_match.title')}</CardHeader>
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
        </ProfileInfo>
        <Text type={TextTypes.Body5}>
          {t('confirm_match.rejected.description', { name })}
        </Text>

        <RejectReasonContainer>
          <form onSubmit={handleSubmit(onSubmit)}>
            <TextArea
              {...register('rejectReason', {
                required: t('error.required'),
              })}
              label={t('confirm_match.reject_reason.label')}
              placeholder={t('confirm_match.reject_reason.placeholder')}
              size={TextAreaSize.Medium}
              error={errors?.rejectReason?.message}
              maxLength={500}
            />
          </form>
        </RejectReasonContainer>
      </CardContent>

      <ButtonsContainer>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={onCancel}
        >
          {t('btn_cancel')}
        </Button>
        <Button
          type="button"
          appearance={ButtonAppearance.Primary}
          onClick={handleSubmit(onSubmit)}
        >
          {t('confirm_match.reject_button')}
        </Button>
      </ButtonsContainer>
    </>
  );
};

const RejectConfirmation: React.FC<RejectConfirmationProps> = ({
  name,
  onClose,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <CardHeader textColor={theme.color.text.title}>
        {t('confirm_match.rejected.title')}
      </CardHeader>
      <CardContent $align="flex-start">
        <Text bold type={TextTypes.Body5}>
          {t('confirm_match.rejected.description', { name })}
        </Text>
        <Text type={TextTypes.Body5}>{t('confirm_match.rejected.info_1')}</Text>
        <Text type={TextTypes.Body5}>{t('confirm_match.rejected.info_2')}</Text>
        <Text type={TextTypes.Body5}>{t('confirm_match.rejected.info_3')}</Text>
      </CardContent>
      <Button
        type="button"
        appearance={ButtonAppearance.Secondary}
        onClick={onClose}
      >
        {t('confirm_match.rejected.button')}
      </Button>
    </>
  );
};

const ConfirmMatchCard = ({
  description,
  name,
  onConfirm,
  onReject,
  onClose,
  image,
  imageType,
}: ConfirmaMatchCardProps) => {
  const [viewState, setViewState] = useState<ViewState>('confirm');

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<RejectFormData>();

  const handleRejectClick = () => {
    setViewState('reject-form');
  };

  const handleCancelReject = () => {
    setViewState('confirm');
    reset();
  };

  const handleRejectSubmit = async (data: RejectFormData) => {
    try {
      await onReject(data.rejectReason);
      setViewState('reject-confirmation');
    } catch (error) {
      // Handle error if needed
      console.error('Reject failed:', error);
    }
  };

  return (
    <Card width={CardSizes.Medium}>
      {viewState === 'confirm' && (
        <ConfirmMatch
          name={name}
          description={description}
          image={image}
          imageType={imageType}
          onConfirm={onConfirm}
          onRejectClick={handleRejectClick}
        />
      )}
      {viewState === 'reject-form' && (
        <RejectMatch
          name={name}
          image={image}
          imageType={imageType}
          onCancel={handleCancelReject}
          onSubmit={handleRejectSubmit}
          errors={errors}
          register={register}
          handleSubmit={handleSubmit}
        />
      )}
      {viewState === 'reject-confirmation' && (
        <RejectConfirmation name={name} onClose={onClose} />
      )}
    </Card>
  );
};

export default ConfirmMatchCard;
