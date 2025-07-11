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

import { registerInput } from '../../../helpers/form.ts';
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

const RejectReasonContainer = styled.form`
  width: 100%;
`;

const RejectNote = styled(Text)`
  text-align: justify;
`;

interface ConfirmaMatchCardProps {
  description: string;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  onReject: (reason: string) => void;
  image: any;
  imageType: string;
}

interface RejectFormData {
  rejectReason: string;
}

type ViewState = 'confirm' | 'reject-form';

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
        <RejectNote type={TextTypes.Body5}>
          {t('confirm_match.reject_info')}
        </RejectNote>
        <RejectReasonContainer onSubmit={handleSubmit(onSubmit)}>
          <TextArea
            {...registerInput({
              register,
              name: 'rejectReason',
              options: {
                required: 'error.required',
                minLength: {
                  value: 20,
                  message: 'error.reject_reason_min_length',
                },
              },
            })}
            label={t('confirm_match.reject_reason_label')}
            placeholder={t('confirm_match.reject_reason_placeholder')}
            size={TextAreaSize.Medium}
            error={t(errors?.rejectReason?.message)}
            maxLength={500}
          />
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
    setError,
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
      onClose();
    } catch (error) {
      setError('root.serverError', {
        type: error?.status,
        message: error?.message || 'error.server_issue',
      });
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
    </Card>
  );
};

export default ConfirmMatchCard;
