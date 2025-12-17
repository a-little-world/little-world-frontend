import {
  Button,
  ButtonAppearance,
  ButtonVariations,
  CardContent,
  CardFooter,
  CardHeader,
  Dropdown,
  Text,
  TextArea,
} from '@a-little-world/little-world-design-system';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled, { useTheme } from 'styled-components';

import { CallSetupCard } from '../Calls/CallSetup';

type PostCallState = 'initial' | 'report' | 'report_confirmed';

const PostCallCard = styled(CallSetupCard)`
  max-width: 500px;
`;

const ReportProblem = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.xsmall};
  align-items: center;
  margin-bottom: ${({ theme }) => theme.spacing.small};
`;

const FormWrapper = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

interface PostRandomCallsFlowProps {
  onReturnToStart: () => void;
  onReturnToLobby: () => void;
}

type ReportFormData = {
  reportReason: string;
  reportDetails: string;
};

const PostRandomCallsFlow = ({
  onReturnToStart,
  onReturnToLobby,
}: PostRandomCallsFlowProps) => {
  const { t } = useTranslation();
  const [flowState, setFlowState] = useState<PostCallState>('initial');
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    reset,
    formState: { isValid },
  } = useForm<ReportFormData>({
    defaultValues: {
      reportReason: '',
      reportDetails: '',
    },
    mode: 'onChange',
  });

  const handleReportClick = () => {
    setFlowState('report');
  };

  const handleCancelReport = () => {
    setFlowState('initial');
    reset();
  };

  const onSubmitReport = (_data: ReportFormData) => {
    // TODO: Submit report to API
    setFlowState('report_confirmed');
    reset();
  };

  // Initial View
  if (flowState === 'initial') {
    return (
      <PostCallCard>
        <CardHeader>{t('random_calls.post_call_title')}</CardHeader>
        <CardContent>
          <Text>{t('random_calls.post_call_description')}</Text>
          <ReportProblem>
            <Text center>{t('random_calls.report_problem')}</Text>
            <Button
              variation={ButtonVariations.Inline}
              onClick={handleReportClick}
              color={theme.color.text.link}
            >
              {t('random_calls.report_btn')}
            </Button>
          </ReportProblem>
        </CardContent>
        <CardFooter align="space-between">
          <Button
            appearance={ButtonAppearance.Secondary}
            onClick={onReturnToStart}
          >
            {t('random_calls.return_to_start')}
          </Button>
          <Button onClick={onReturnToLobby}>
            {t('random_calls.search_again')}
          </Button>
        </CardFooter>
      </PostCallCard>
    );
  }

  // Report Card View
  if (flowState === 'report') {
    const reportReasonOptions = [
      { value: 'call_quality', label: t('random_calls.report_reason_quality') },
      {
        value: 'report_partner',
        label: t('random_calls.report_reason_partner'),
      },
    ];

    return (
      <PostCallCard>
        <CardHeader>{t('random_calls.report_card_title')}</CardHeader>
        <CardContent>
          <FormWrapper onSubmit={handleSubmit(onSubmitReport)}>
            <Text>{t('random_calls.report_card_description')}</Text>

            <Controller
              name="reportReason"
              control={control}
              rules={{ required: t('validation.required') }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <Dropdown
                  label={t('random_calls.report_reason_label')}
                  placeholder={t('random_calls.report_reason_placeholder')}
                  options={reportReasonOptions}
                  value={value}
                  onValueChange={onChange}
                  error={error?.message}
                />
              )}
            />

            <Controller
              name="reportDetails"
              control={control}
              rules={{ required: t('validation.required') }}
              render={({
                field: { onChange, value },
                fieldState: { error },
              }) => (
                <TextArea
                  label={t('random_calls.report_details_label')}
                  placeholder={t('random_calls.report_details_placeholder')}
                  value={value}
                  onChange={onChange}
                  rows={5}
                  error={error?.message}
                />
              )}
            />
          </FormWrapper>
        </CardContent>
        <CardFooter align="space-between">
          <Button
            appearance={ButtonAppearance.Secondary}
            onClick={handleCancelReport}
          >
            {t('random_calls.report_cancel_btn')}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmitReport)}
            disabled={!isValid}
          >
            {t('random_calls.report_submit_btn')}
          </Button>
        </CardFooter>
      </PostCallCard>
    );
  }

  // Report Confirmation View
  if (flowState === 'report_confirmed') {
    return (
      <PostCallCard>
        <CardHeader>{t('random_calls.report_confirmed_title')}</CardHeader>
        <CardContent>
          <Text center>{t('random_calls.report_confirmed_description')}</Text>
        </CardContent>
        <CardFooter align="space-between">
          <Button
            onClick={onReturnToStart}
            appearance={ButtonAppearance.Secondary}
          >
            {t('random_calls.return_to_start')}
          </Button>
          <Button onClick={onReturnToLobby}>
            {t('random_calls.search_again')}
          </Button>
        </CardFooter>
      </PostCallCard>
    );
  }

  return null;
};

export default PostRandomCallsFlow;
