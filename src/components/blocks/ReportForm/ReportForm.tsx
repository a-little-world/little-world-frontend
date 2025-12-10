import {
  Button,
  ButtonAppearance,
  RadioGroup,
  StatusMessage,
  StatusTypes,
  Text,
  TextArea,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { RefObject, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  REPORT_KEYWORDS_BY_TYPE,
  REPORT_TYPE_OPTIONS,
  ReportType,
} from './reportKeywords';

export const PARTNER_ACTION_REPORT = 'report';
export const PARTNER_ACTION_UNMATCH = 'unmatch';

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
  overflow: scroll;
`;

const ReasonWrapper = styled.div``;

const RadioGroupWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};
`;

const ButtonsWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => `
    @media (min-width: ${theme.breakpoints.small}) {
        flex-direction: row-reverse;
        align-items: center;
        justify-content: space-between;
        width: 100%;
    }`}
`;

interface ReportFormProps {
  data: {
    matchId: string;
    userName: string;
    type: string;
  };
  onClose: () => void;
  onSubmit: (formData: {
    reason: string;
    reportType?: string;
    keywords?: string;
  }) => void;
  reportType?: ReportType;
}

function ReportForm({ data, onSubmit, onClose, reportType }: ReportFormProps) {
  const { t } = useTranslation();
  const reportTypeRef = useRef<HTMLInputElement>(
    null,
  ) as RefObject<HTMLInputElement>;
  const keywordsRef = useRef<HTMLInputElement>(
    null,
  ) as RefObject<HTMLInputElement>;
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      reportType: reportType || 'call_quality',
      keywords: '',
      reason: '',
    },
  });

  const selectedReportType = watch('reportType') || reportType;
  const isUnmatch = data.type === 'unmatch';

  // Memoize translated report type options
  const reportTypeOptions = useMemo(
    () =>
      REPORT_TYPE_OPTIONS.map(option => ({
        id: option.id,
        label: t(option.translationKey),
        value: option.value,
      })),
    [t],
  );

  // Memoize translated keyword options based on selected report type
  const keywordOptions = useMemo(() => {
    if (!selectedReportType) {
      return [];
    }
    const keywords = REPORT_KEYWORDS_BY_TYPE[selectedReportType as ReportType];
    if (!keywords) {
      return [];
    }
    return keywords.map(keyword => ({
      id: keyword.id,
      label: t(keyword.translationKey),
      value: keyword.value,
    }));
  }, [selectedReportType, t]);

  const handleOnClose = () => {
    onClose();
    reset();
  };

  const handleSubmitReport = (formData: {
    reason: string;
    reportType?: string;
    keywords?: string;
  }) => {
    onSubmit({
      reason: formData.reason,
      reportType: formData.reportType || reportType,
      keywords: formData.keywords || undefined,
    });
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitReport)}>
      <Text type={TextTypes.Heading4} tag="h2" center>
        {t(`${data?.type}_modal_title`, { name: data.userName })}
      </Text>
      <Text>
        {t(`${data?.type}_modal_description`, {
          name: data?.userName,
        })}
      </Text>

      {/* Report Type Selection - only show if not unmatch and reportType prop is not provided */}
      {!isUnmatch && !reportType && (
        <RadioGroupWrapper>
          <Controller
            control={control}
            name="reportType"
            rules={{
              required: t('report.report_type_required'),
            }}
            render={({
              field: { onChange, onBlur, value, name },
              fieldState: { error },
            }) => (
              <RadioGroup
                name={name}
                value={value}
                onBlur={onBlur}
                inputRef={reportTypeRef}
                error={error?.message}
                onValueChange={onChange}
                items={reportTypeOptions}
                label={t('report.report_type_label')}
              />
            )}
          />
        </RadioGroupWrapper>
      )}

      {/* Keywords Selection - only show if not unmatch and reportType is selected */}
      {!isUnmatch && selectedReportType && (
        <RadioGroupWrapper>
          <Controller
            control={control}
            name="keywords"
            render={({
              field: { onChange, onBlur, value, name },
              fieldState: { error },
            }) => (
              <RadioGroup
                name={name}
                value={value}
                onBlur={onBlur}
                inputRef={keywordsRef}
                error={error?.message}
                onValueChange={onChange}
                items={keywordOptions}
                label={t('report.keywords_label')}
              />
            )}
          />
        </RadioGroupWrapper>
      )}

      <ReasonWrapper>
        <Controller
          control={control}
          name="reason"
          rules={{
            required: t(`${data.type}_modal_reason_error_required`),
            minLength: {
              value: 50,
              message: t(`${data.type}_modal_reason_error_min_length`),
            },
          }}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { error },
          }) => (
            <TextArea
              inputRef={ref}
              label={t(`${data?.type}_modal_reason_label`, {
                name: data.userName,
              })}
              error={error?.message}
              placeholder={t(`${data?.type}_modal_reason_placeholder`)}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
            />
          )}
        />
        {errors?.root?.serverError && (
          <StatusMessage
            visible={!!errors?.root?.serverError}
            type={StatusTypes.Error}
          >
            {errors?.root?.serverError?.message
              ? t(errors.root.serverError.message)
              : ''}
          </StatusMessage>
        )}
      </ReasonWrapper>

      <ButtonsWrapper>
        <Button type="submit">{t(`${data?.type}_modal_confirm_btn`)}</Button>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={handleOnClose}
        >
          {t(`${data?.type}_modal_cancel_btn`)}
        </Button>
      </ButtonsWrapper>
    </Form>
  );
}

export default ReportForm;
