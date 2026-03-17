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

import { confirmOrDenyMatch } from '../../../api/matches';
import { MATCH_TYPES } from '../../../constants';
import { revalidateMatches } from '../../../features/swr/index';
import { registerInput } from '../../../helpers/form';
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
  width: 100%;
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
  matchId: string;
  matchType: 'standard' | 'random_call';
  image: any;
  imageType: string;
}

interface RejectFormData {
  rejectReason: string;
}

type ViewState = 'confirm' | 'reject-form';

interface BaseMatchProps {
  name: string;
  image: any;
  imageType: string;
  isLoading: boolean;
  matchType: string;
}

interface ConfirmMatchProps extends BaseMatchProps {
  description: string;
  onConfirm: () => void;
  onRejectClick: () => void;
}

interface RejectMatchProps extends BaseMatchProps {
  onCancel: () => void;
  onSubmit: (data: RejectFormData) => void;
  errors: any;
  register: any;
  handleSubmit: any;
}

const getTitleKey = (matchType: string) =>
  matchType === MATCH_TYPES.standard
    ? 'confirm_match.title_standard'
    : 'confirm_match.title_random_call';

const ConfirmMatch: React.FC<ConfirmMatchProps> = ({
  name,
  description,
  image,
  imageType,
  onConfirm,
  onRejectClick,
  isLoading,
  matchType,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <CardHeader>{t(getTitleKey(matchType))}</CardHeader>
      <CardContent
        align="center"
        textAlign="center"
        marginBottom={theme.spacing.large}
      >
        <ProfileInfo>
          <ProfileImage image={image} imageType={imageType} />
          <Text tag="h3" bold type={TextTypes.Heading5} center>
            {name}
          </Text>
          <TextField>{description}</TextField>
        </ProfileInfo>
        {matchType === MATCH_TYPES.standard && (
          <>
            <Text type={TextTypes.Body5}>
              {t('confirm_match.description', { name })}
            </Text>
            <Text type={TextTypes.Body5}>
              {t('confirm_match.instruction', { name })}
            </Text>
          </>
        )}
      </CardContent>

      <ButtonsContainer>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={onRejectClick}
          disabled={isLoading}
        >
          {t('confirm_match.reject_button')}
        </Button>
        <Button
          type="button"
          onClick={onConfirm}
          loading={isLoading}
          disabled={isLoading}
        >
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
  isLoading,
  matchType,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();

  return (
    <>
      <CardHeader>{t(getTitleKey(matchType))}</CardHeader>
      <CardContent
        align="center"
        textAlign="center"
        marginBottom={theme.spacing.large}
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
            id="rejectReason"
            label={t('confirm_match.reject_reason_label')}
            placeholder={t('confirm_match.reject_reason_placeholder')}
            size={TextAreaSize.Medium}
            error={t(errors?.rejectReason?.message)}
            maxLength={500}
            disabled={isLoading}
          />
        </RejectReasonContainer>
      </CardContent>

      <ButtonsContainer>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('btn_cancel')}
        </Button>
        <Button
          type="button"
          appearance={ButtonAppearance.Primary}
          onClick={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
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
  matchId,
  matchType,
  onClose,
  image,
  imageType,
}: ConfirmaMatchCardProps) => {
  const [viewState, setViewState] = useState<ViewState>('confirm');
  const [isLoading, setIsLoading] = useState(false);
  const isRandomCall = matchType === MATCH_TYPES.random_call;

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<RejectFormData>();

  const handleConfirm = () => {
    setIsLoading(true);
    confirmOrDenyMatch({
      acceptDeny: true,
      matchId,
      onSuccess: () => {
        setIsLoading(false);
        revalidateMatches();
        onClose();
      },
      onError: (apiError: any) => {
        setIsLoading(false);
        setError('root.serverError', {
          type: apiError?.status,
          message: apiError?.message || 'error.server_issue',
        });
      },
    });
  };

  const handleRejectClick = () => {
    if (isRandomCall) {
      handleReject();
      return;
    }
    setViewState('reject-form');
  };

  const handleCancelReject = () => {
    setViewState('confirm');
    reset();
  };

  const handleReject = (denyReason?: string) => {
    setIsLoading(true);
    confirmOrDenyMatch({
      acceptDeny: false,
      matchId,
      denyReason,
      onSuccess: () => {
        setIsLoading(false);
        revalidateMatches();
        onClose();
      },
      onError: (apiError: any) => {
        setIsLoading(false);
        setError('root.serverError', {
          type: apiError?.status,
          message: apiError?.message || 'error.server_issue',
        });
      },
    });
  };

  return (
    <Card width={CardSizes.Medium}>
      {viewState === 'confirm' && (
        <ConfirmMatch
          name={name}
          description={description}
          image={image}
          imageType={imageType}
          onConfirm={handleConfirm}
          onRejectClick={handleRejectClick}
          isLoading={isLoading}
          matchType={matchType}
        />
      )}
      {viewState === 'reject-form' && (
        <RejectMatch
          name={name}
          image={image}
          imageType={imageType}
          onCancel={handleCancelReject}
          onSubmit={(data: RejectFormData) => handleReject(data.rejectReason)}
          errors={errors}
          register={register}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          matchType={matchType}
        />
      )}
    </Card>
  );
};

export default ConfirmMatchCard;
