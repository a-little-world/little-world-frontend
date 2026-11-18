import { RefObject, useRef, useState } from 'react';

import {
  Button,
  ButtonSizes,
  Card,
  CardHeader,
  CardSizes,
  InputError,
  RadioGroup,
  StatusMessage,
  StatusTypes,
  Text,
  TextArea,
  TextAreaSize,
  TextInput,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { FeedbackArea, submitFeedback } from '../../../api/feedback';
import FileDropzone, { AcceptedFiles } from '../FileDropzone/FileDropzone';
import { FeedbackForm } from './Feedback.styles';

const AREAS: FeedbackArea[] = ['calls', 'chat', 'matching', 'profile', 'other'];
const MAX_SCREENSHOTS = 3;

interface BugReportFields {
  area: FeedbackArea | '';
  areaOther: string;
  message: string;
}

function BugReportForm({ onSent }: { onSent: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const areaRef = useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>;
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<BugReportFields>({
    defaultValues: { area: '', areaOther: '', message: '' },
  });

  const tooManyScreenshots = screenshots.length > MAX_SCREENSHOTS;

  const onValid = async ({ area, areaOther, message }: BugReportFields) => {
    if (tooManyScreenshots) return;
    setSubmitError(null);
    try {
      await submitFeedback({
        kind: 'bug',
        area: area || undefined,
        areaOther: area === 'other' ? areaOther : undefined,
        message,
        attachments: screenshots,
      });
      onSent();
    } catch (error: any) {
      setSubmitError(t(error?.message || 'error.server_error'));
    }
  };

  return (
    <Card width={CardSizes.Large}>
      <CardHeader textColor={theme.color.text.title}>
        {t('help.feedback.bug.title')}
      </CardHeader>
      <FeedbackForm noValidate onSubmit={handleSubmit(onValid)}>
        <Controller
          control={control}
          name="area"
          rules={{ required: t('error.required') }}
          render={({ field, fieldState }) => (
            <RadioGroup
              name={field.name}
              inputRef={areaRef}
              label={t('help.feedback.bug.area')}
              value={field.value}
              onValueChange={field.onChange}
              orientation="vertical"
              required
              error={fieldState.error?.message}
              items={AREAS.map(area => ({
                id: `feedback_area_${area}`,
                value: area,
                label: t(`help.feedback.bug.area_${area}`),
              }))}
            />
          )}
        />
        {watch('area') === 'other' && (
          <Controller
            control={control}
            name="areaOther"
            rules={{
              validate: value => !!value.trim() || t('error.required'),
            }}
            render={({ field, fieldState }) => (
              <TextInput
                {...field}
                id="feedback_area_custom"
                placeholder={t('help.feedback.bug.area_other_placeholder')}
                error={fieldState.error?.message}
              />
            )}
          />
        )}
        <Controller
          control={control}
          name="message"
          rules={{
            validate: value => !!value.trim() || t('error.required'),
          }}
          render={({ field, fieldState }) => (
            <TextArea
              {...field}
              id="feedback_message"
              label={t('help.feedback.bug.message')}
              placeholder={t('help.feedback.bug.message_placeholder')}
              size={TextAreaSize.Medium}
              required
              error={fieldState.error?.message}
            />
          )}
        />
        <div>
          <FileDropzone
            acceptedFiles={AcceptedFiles.Images}
            label={t('help.feedback.bug.screenshots')}
            multiple
            onFileChange={setScreenshots}
          />
          <InputError visible={tooManyScreenshots} textAlign="left">
            {t('help.feedback.bug.too_many_screenshots', {
              max: MAX_SCREENSHOTS,
            })}
          </InputError>
        </div>
        <Text type={TextTypes.Body6} color={theme.color.text.tertiary}>
          {t('help.feedback.bug.device_note')}
        </Text>
        {!!submitError && (
          <StatusMessage visible type={StatusTypes.Error}>
            {submitError}
          </StatusMessage>
        )}
        <Button
          type="submit"
          size={ButtonSizes.Stretch}
          disabled={isSubmitting}
        >
          {t('help.feedback.bug.submit')}
        </Button>
      </FeedbackForm>
    </Card>
  );
}

export default BugReportForm;
