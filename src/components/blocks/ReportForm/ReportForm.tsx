import {
  Button,
  ButtonAppearance,
  MultiSelection,
  RadioGroup,
  StatusMessage,
  StatusTypes,
  Text,
  TextArea,
  TextAreaSize,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { RefObject, useMemo, useRef } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

import {
  REPORT_KEYWORDS_BY_TYPE,
  REPORT_TYPE_CALL_QUALITY,
  REPORT_TYPE_OPTIONS,
  REPORT_TYPE_PARTNER,
  REPORT_TYPE_UNMATCH,
  ReportType,
} from './constants';

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
  reportedUserName: string;
  onClose: () => void;
  onSubmit: (formData: {
    reason: string;
    reportType: ReportType;
    keywords?: [string];
  }) => void;
  reportType?: ReportType;
}

function ReportForm({
  onSubmit,
  onClose,
  reportType,
  reportedUserName,
}: ReportFormProps) {
  const { t } = useTranslation();
  const reportTypeRef = useRef<HTMLInputElement>(
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
      reportType: reportType || REPORT_TYPE_CALL_QUALITY,
      keywords: undefined,
      reason: '',
    },
  });

  const selectedReportType = watch('reportType') || reportType;
  const isUnmatch = reportType === REPORT_TYPE_UNMATCH;
  const isReportMatch = reportType === REPORT_TYPE_PARTNER;
  const translationKeyPrefix = isUnmatch ? 'unmatch' : 'report';

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
      tag: t(keyword.translationKey),
      value: keyword.value,
    }));
  }, [selectedReportType, t]);

  const handleOnClose = () => {
    onClose();
    reset();
  };

  const handleSubmitReport = (formData: {
    reason: string;
    reportType?: ReportType;
    keywords?: [string];
  }) => {
    onSubmit({
      reason: formData.reason,
      reportType: formData.reportType || selectedReportType,
      keywords: formData.keywords,
    });
  };

  return (
    <Form onSubmit={handleSubmit(handleSubmitReport)}>
      <Text type={TextTypes.Heading4} tag="h2" center>
        {t(
          `${translationKeyPrefix}.${
            reportedUserName ? 'partner' : 'generic'
          }_title`,
          {
            name: reportedUserName,
          },
        )}
      </Text>
      <Text>
        {t(
          `${translationKeyPrefix}.${
            reportedUserName ? 'partner' : 'generic'
          }_description`,
          {
            name: reportedUserName,
          },
        )}
      </Text>

      {/* Report Type Selection - only show if not unmatch and reportType prop is not provided */}
      {!isUnmatch && !isReportMatch && (
        <RadioGroupWrapper>
          <Controller
            control={control}
            name="reportType"
            rules={{
              required: t('error.required'),
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
                label={t('report.type_label')}
                // @ts-expect-error - "pill" is a valid value but not in the RadioGroupVariations type definition
                type="pill"
              />
            )}
          />
        </RadioGroupWrapper>
      )}

      {/* Keywords Selection - only show if not unmatch */}
      {!isUnmatch && (
        <RadioGroupWrapper>
          <Controller
            control={control}
            name="keywords"
            render={({ field: { onChange }, fieldState: { error } }) => (
              <MultiSelection
                id="form-keywords"
                error={error?.message}
                onSelection={onChange}
                options={keywordOptions}
                label={t('report.keywords_label')}
                withBackground={false}
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
            required: t('error.required'),
            minLength: {
              value: 50,
              message: t(`${translationKeyPrefix}.reason_error_min_length`),
            },
          }}
          render={({
            field: { onChange, onBlur, value, name, ref },
            fieldState: { error },
          }) => (
            <TextArea
              inputRef={ref}
              label={t(`${translationKeyPrefix}.reason_label`, {
                name: reportedUserName,
              })}
              error={error?.message}
              placeholder={t(`${translationKeyPrefix}.reason_placeholder`)}
              onChange={onChange}
              onBlur={onBlur}
              value={value}
              name={name}
              size={TextAreaSize.Medium}
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
        <Button type="submit">
          {t(`${translationKeyPrefix}.confirm_btn`)}
        </Button>
        <Button
          type="button"
          appearance={ButtonAppearance.Secondary}
          onClick={handleOnClose}
        >
          {t(`${translationKeyPrefix}.cancel_btn`)}
        </Button>
      </ButtonsWrapper>
    </Form>
  );
}

export default ReportForm;
