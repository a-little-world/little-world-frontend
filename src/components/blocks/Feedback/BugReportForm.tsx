import { RefObject, useRef, useState } from 'react';

import {
  Button,
  ButtonSizes,
  Card,
  CardHeader,
  CardSizes,
  FileUploader,
  InputError,
  Label,
  RadioGroup,
  StatusMessage,
  StatusTypes,
  TextArea,
  TextAreaSize,
  TextInput,
} from '@a-little-world/little-world-design-system';
import { Controller, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { submitFeedback } from '../../../api/feedback';
import DeviceInfoOption from './DeviceInfoOption';
import { FeedbackForm } from './Feedback.styles';

const AREAS = {
  calls: 'Video calls',
  chat: 'Chat',
  matching: 'Matching',
  profile: 'Profile & settings',
};
type AreaChoice = keyof typeof AREAS | 'other';
const AREA_CHOICES = [...Object.keys(AREAS), 'other'] as AreaChoice[];
const MAX_SCREENSHOTS = 3;

interface BugReportFields {
  area: AreaChoice | '';
  areaOther: string;
  message: string;
}

function BugReportForm({ onSent }: { onSent: () => void }) {
  const { t } = useTranslation();
  const theme = useTheme();
  const areaRef = useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>;
  const [screenshots, setScreenshots] = useState<File[]>([]);
  const [tooManyScreenshots, setTooManyScreenshots] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [includeDeviceInfo, setIncludeDeviceInfo] = useState(true);
  const {
    control,
    handleSubmit,
    watch,
    formState: { isSubmitting },
  } = useForm<BugReportFields>({
    defaultValues: { area: '', areaOther: '', message: '' },
  });

  const onValid = async ({ area, areaOther, message }: BugReportFields) => {
    setSubmitError(null);
    try {
      await submitFeedback({
        kind: 'bug',
        details: {
          area:
            area === 'other'
              ? areaOther.trim()
              : AREAS[area as keyof typeof AREAS],
        },
        message,
        attachments: screenshots,
        includeDeviceInfo,
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
              items={AREA_CHOICES.map(area => ({
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
          <Label bold>{t('help.feedback.bug.screenshots')}</Label>
          <FileUploader
            accept="image/*"
            maxFiles={MAX_SCREENSHOTS}
            label={t('file_upload.click_to_upload')}
            hint={t('file_upload.drop_hint')}
            onFilesChange={files => {
              setScreenshots(files);
              if (files.length < MAX_SCREENSHOTS) setTooManyScreenshots(false);
            }}
            onError={() => setTooManyScreenshots(true)}
          />
          <InputError visible={tooManyScreenshots} textAlign="left">
            {t('help.feedback.bug.too_many_screenshots', {
              max: MAX_SCREENSHOTS,
            })}
          </InputError>
        </div>
        <DeviceInfoOption
          checked={includeDeviceInfo}
          onCheckedChange={setIncludeDeviceInfo}
        />
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
