import {
  Accordion,
  AccordionContent,
  Button,
  ButtonAppearance,
  CalendarIcon,
  Card,
  CardContent,
  CardHeader,
  CardSizes,
  Tag,
  TagAppearance,
  TagSizes,
  Text,
  TextArea,
  TextAreaSize,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import React, { useCallback, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';
import useSWR from 'swr';

import { confirmOrDenyMatch } from '../../../api/matches';
import { MATCH_TYPES } from '../../../constants';
import { revalidateMatches, USER_ENDPOINT } from '../../../features/swr/index';
import {
  buildAvailabilityRows,
  formatSuggestedAvailabilityOverlap,
} from '../../../helpers/availability';
import { registerInput } from '../../../helpers/form';
import ButtonsContainer from '../../atoms/ButtonsContainer';
import Note from '../../atoms/Note';
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

const Description = styled(Text)`
  margin-bottom: ${({ theme }) => theme.spacing.xxsmall};
`;

const MessageContainer = styled.form`
  width: 100%;
`;

const AccordionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const AvailabilityAccordion = styled(Accordion)`
  width: 100%;
`;

const AvailabilityContent = styled(AccordionContent)`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
  width: 100%;
  background: ${({ theme }) => theme.color.surface.primary};
  padding: 0;
  padding-top: ${({ theme }) => theme.spacing.small};
`;

const AvailabilityList = styled.div`
  display: flex;
  flex-direction: column;
`;

const AvailabilityDayRow = styled.div`
  display: flex;
  align-items: center;
  gap: ${({ theme }) => theme.spacing.xsmall};
  padding: ${({ theme }) => theme.spacing.xxsmall}
    ${({ theme }) => theme.spacing.xxxxsmall};

  & + & {
    border-top: 1px solid ${({ theme }) => theme.color.border.subtle};
  }
`;

const AvailabilityDayLabel = styled(Text)`
  flex-shrink: 0;
  width: 40px;
`;

const AvailabilityRanges = styled.div`
  display: flex;
  flex: 1;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacing.xxsmall};
`;

const RejectNote = styled(Text)`
  text-align: justify;
`;

const TimeSlot = styled(Tag)`
  color: ${({ theme }) => theme.color.text.primary};
`;

interface ConfirmaMatchCardProps {
  description: string;
  name: string;
  onClose: () => void;
  matchId: string;
  matchType: 'standard' | 'random_call';
  image: any;
  imageType: string;
  partnerAvailability?: Record<string, string[]>;
}

interface MatchDecisionFormData {
  rejectReason?: string;
  confirmMessage: string;
}

type ViewState = 'confirm' | 'confirm-message-form' | 'reject-form';

interface BaseMatchProps {
  name: string;
  image: any;
  imageType: string;
  isLoading: boolean;
  matchType: string;
}

interface ConfirmMatchProps extends BaseMatchProps {
  description: string;
  onConfirmClick: () => void;
  onRejectClick: () => void;
}

interface ConfirmMessageProps extends BaseMatchProps {
  onCancel: () => void;
  onSubmit: (data: MatchDecisionFormData) => void;
  errors: any;
  register: any;
  handleSubmit: any;
  partnerAvailability?: Record<string, string[]>;
}

interface RejectMatchProps extends BaseMatchProps {
  onCancel: () => void;
  onSubmit: (data: MatchDecisionFormData) => void;
  errors: any;
  register: any;
  handleSubmit: any;
}

const getTitleKey = (matchType: string) =>
  matchType === MATCH_TYPES.standard
    ? 'confirm_match.title_standard'
    : 'confirm_match.title_random_call';

const getDefaultConfirmMessageKey = (suggestedAvailability?: string) =>
  suggestedAvailability
    ? 'confirm_match.message_default_with_availability'
    : 'confirm_match.message_default';

const ConfirmMatch: React.FC<ConfirmMatchProps> = ({
  name,
  description,
  image,
  imageType,
  onConfirmClick,
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
          <ProfileImage
            image={image}
            imageType={imageType}
            size="medium"
            circle
          />
          <Text tag="h3" bold type={TextTypes.Heading5} center>
            {name}
          </Text>
          <Description type={TextTypes.Body5}>
            {t('confirm_match.description')}
          </Description>
          <TextField>„{description?.trim()}“</TextField>
        </ProfileInfo>
        {matchType === MATCH_TYPES.standard && (
          <Text type={TextTypes.Body5}>
            {t('confirm_match.instruction', { name })}
          </Text>
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
          onClick={onConfirmClick}
          loading={isLoading}
          disabled={isLoading}
        >
          {t('confirm_match.confirm_button')}
        </Button>
      </ButtonsContainer>
    </>
  );
};

const ConfirmMessage: React.FC<ConfirmMessageProps> = ({
  name,
  image,
  imageType,
  onCancel,
  onSubmit,
  errors,
  register,
  handleSubmit,
  isLoading,
  partnerAvailability,
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const availabilityRows = useMemo(
    () => buildAvailabilityRows(partnerAvailability),
    [partnerAvailability],
  );
  const showAvailability = availabilityRows.length > 0;

  return (
    <>
      <CardHeader>{t('confirm_match.message_title', { name })}</CardHeader>
      <CardContent
        align="center"
        textAlign="center"
        marginBottom={theme.spacing.large}
      >
        <ProfileInfo>
          <ProfileImage
            image={image}
            imageType={imageType}
            size="medium"
            circle
          />
          <Text tag="h3" bold type={TextTypes.Heading5} center>
            {name}
          </Text>
          <Text type={TextTypes.Body5}>
            {t('confirm_match.message_info', { name })}
          </Text>
        </ProfileInfo>
        {showAvailability && (
          <AvailabilityAccordion
            headerType={TextTypes.Heading7}
            ContentWrapper={AvailabilityContent}
            items={[
              {
                // @ts-expect-error Accordion header typing expects string; ReactNode works at runtime
                header: (
                  <AccordionHeader>
                    <CalendarIcon label="" width={16} height={16} />
                    {t('confirm_match.availability_accordion', { name })}
                  </AccordionHeader>
                ),
                content: (
                  <>
                    <Note center={false}>
                      {t('confirm_match.availability_timezone_note')}
                    </Note>
                    <AvailabilityList>
                      {availabilityRows.map(({ day, ranges }) => (
                        <AvailabilityDayRow key={day}>
                          <AvailabilityDayLabel bold>
                            {t(`availability.day_short_${day}`)}
                          </AvailabilityDayLabel>
                          <AvailabilityRanges>
                            {ranges.map(range => (
                              <TimeSlot
                                key={range}
                                appearance={TagAppearance.filled}
                                color={theme.color.surface.subtle}
                                size={TagSizes.small}
                              >
                                {range}
                              </TimeSlot>
                            ))}
                          </AvailabilityRanges>
                        </AvailabilityDayRow>
                      ))}
                    </AvailabilityList>
                  </>
                ),
              },
            ]}
          />
        )}
        <MessageContainer onSubmit={handleSubmit(onSubmit)}>
          <TextArea
            {...registerInput({
              register,
              name: 'confirmMessage',
              options: {
                required: 'error.required',
                validate: (value: string) =>
                  value.trim().length > 0 || 'error.required',
              },
            })}
            id="confirmMessage"
            label={t('confirm_match.message_label')}
            placeholder={t('confirm_match.message_placeholder', { name })}
            size={TextAreaSize.Medium}
            error={t(errors?.confirmMessage?.message)}
            disabled={isLoading}
          />
        </MessageContainer>
      </CardContent>

      <ButtonsContainer>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={onCancel}
          disabled={isLoading}
        >
          {t('form.btn_back')}
        </Button>
        <Button
          type="button"
          appearance={ButtonAppearance.Primary}
          onClick={handleSubmit(onSubmit)}
          loading={isLoading}
          disabled={isLoading}
        >
          {t('confirm_match.confirm_and_send_button')}
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
          <ProfileImage
            image={image}
            imageType={imageType}
            size="medium"
            circle
          />
          <Text tag="h3" bold type={TextTypes.Heading5} center>
            {name}
          </Text>
        </ProfileInfo>
        <RejectNote type={TextTypes.Body5}>
          {t('confirm_match.reject_info')}
        </RejectNote>
        <MessageContainer onSubmit={handleSubmit(onSubmit)}>
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
        </MessageContainer>
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
  partnerAvailability,
}: ConfirmaMatchCardProps) => {
  const { t } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT);
  const [viewState, setViewState] = useState<ViewState>('confirm');
  const [isLoading, setIsLoading] = useState(false);
  const isRandomCall = matchType === MATCH_TYPES.random_call;

  const buildConfirmMessage = useCallback(() => {
    const suggestedAvailability = formatSuggestedAvailabilityOverlap(
      user?.profile?.availability,
      partnerAvailability,
    );

    return t(getDefaultConfirmMessageKey(suggestedAvailability), {
      name,
      suggestedAvailability,
    });
  }, [name, partnerAvailability, t, user?.profile?.availability]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset,
  } = useForm<MatchDecisionFormData>({
    defaultValues: {
      confirmMessage: '',
    },
  });

  const handleConfirmClick = () => {
    if (matchType !== MATCH_TYPES.standard) {
      handleConfirm();
      return;
    }

    reset({ confirmMessage: buildConfirmMessage() });
    setViewState('confirm-message-form');
  };

  const handleCancelConfirm = () => {
    setViewState('confirm');
  };

  const handleConfirm = (confirmMessage?: string) => {
    setIsLoading(true);
    confirmOrDenyMatch({
      acceptDeny: true,
      matchId,
      ...(confirmMessage ? { confirmMessage: confirmMessage.trim() } : {}),
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
          onConfirmClick={handleConfirmClick}
          onRejectClick={handleRejectClick}
          isLoading={isLoading}
          matchType={matchType}
        />
      )}
      {viewState === 'confirm-message-form' && (
        <ConfirmMessage
          name={name}
          image={image}
          imageType={imageType}
          onCancel={handleCancelConfirm}
          onSubmit={(data: MatchDecisionFormData) =>
            handleConfirm(data.confirmMessage)
          }
          errors={errors}
          register={register}
          handleSubmit={handleSubmit}
          isLoading={isLoading}
          matchType={matchType}
          partnerAvailability={partnerAvailability}
        />
      )}
      {viewState === 'reject-form' && (
        <RejectMatch
          name={name}
          image={image}
          imageType={imageType}
          onCancel={handleCancelReject}
          onSubmit={(data: MatchDecisionFormData) =>
            handleReject(data.rejectReason)
          }
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
