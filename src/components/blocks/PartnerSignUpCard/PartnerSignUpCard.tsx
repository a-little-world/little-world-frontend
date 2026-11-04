import { FormEvent } from 'react';

import {
  ButtonSizes,
  ClockIcon,
  ConfettiImage,
  ExclamationIcon,
  Link,
  MailIcon,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { PartnerLanding } from '../../../api/partnerLanding';
import {
  calendarDaysUntil,
  formatDate,
  formatTimeRange,
} from '../../../helpers/date';
import { PARTNER_EVENT } from '../../views/PartnerLanding/constants';
import {
  AppointmentCopy,
  AppointmentDate,
  AppointmentEyebrow,
  AppointmentRow,
  CardShell,
  DashedDivider,
  DateLong,
  DateShort,
  DaysPill,
  DoorBadge,
  DoorKnob,
  DoorNumber,
  EmailField,
  ErrorRow,
  ErrorText,
  FormStack,
  Microcopy,
  NewsletterCheckbox,
  NewsletterLabel,
  NewsletterRow,
  SubmitButton,
  SuccessBody,
  SuccessState,
  SuccessTitle,
  SupportRow,
  SupportText,
  TimeLabel,
  TimeRow,
} from './PartnerSignUpCard.styles';

export const SUPPORT_EMAIL = 'support@little-world.com';

export interface PartnerSignUpCardProps {
  partner: PartnerLanding;
  email: string;
  newsletter: boolean;
  error: string | null;
  isSubmitting: boolean;
  success: boolean;
  inputId: string;
  onEmailChange: (value: string) => void;
  onNewsletterChange: (value: boolean) => void;
  onSubmit: () => void;
}

const PartnerSignUpCard = ({
  partner,
  email,
  newsletter,
  error,
  isSubmitting,
  success,
  inputId,
  onEmailChange,
  onNewsletterChange,
  onSubmit,
}: PartnerSignUpCardProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { startsAt, endsAt } = PARTNER_EVENT;
  const daysUntil = calendarDaysUntil(startsAt);
  const exampleEmail = partner.email_domain
    ? `vorname.name@${partner.email_domain}`
    : 'name@firma.de';

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <CardShell>
      <AppointmentRow>
        <DoorBadge>
          <DoorNumber>{PARTNER_EVENT.doorNumber}</DoorNumber>
          <DoorKnob />
        </DoorBadge>
        <AppointmentCopy>
          <AppointmentEyebrow>
            {t('partner_landing.appointment_eyebrow')}
          </AppointmentEyebrow>
          <AppointmentDate>
            <DateLong>
              {formatDate(startsAt, 'EEEE, d. MMMM yyyy', i18n.language)}
            </DateLong>
            <DateShort>
              {formatDate(startsAt, 'EEEEEE, d. MMMM yyyy', i18n.language)}
            </DateShort>
          </AppointmentDate>
          <TimeRow>
            <TimeLabel>
              <ClockIcon
                label={t('partner_landing.time_icon_label')}
                width={24}
                color={theme.color.text.primary}
              />
              {t('partner_landing.time_range', {
                time: formatTimeRange(startsAt, endsAt),
              })}
            </TimeLabel>
            {daysUntil >= 0 && (
              <DaysPill>
                {daysUntil === 0
                  ? t('partner_landing.today')
                  : t('partner_landing.in_days', { count: daysUntil })}
              </DaysPill>
            )}
          </TimeRow>
        </AppointmentCopy>
      </AppointmentRow>
      <DashedDivider />

      {success ? (
        <SuccessState role="status">
          <ConfettiImage
            label={t('partner_landing.success_icon_label')}
            width={96}
            height={96}
          />
          <SuccessTitle>
            {t('partner_landing.success_title', {
              eventDate: formatDate(startsAt, 'd. MMMM', i18n.language),
            })}
          </SuccessTitle>
          <SuccessBody>{t('partner_landing.success_thanks')}</SuccessBody>
          <SuccessBody>{t('partner_landing.success_email_hint')}</SuccessBody>
        </SuccessState>
      ) : (
        <>
          <FormStack onSubmit={handleSubmit} noValidate>
            <EmailField
              id={inputId}
              label={t('partner_landing.email_label')}
              type="email"
              inputMode="email"
              value={email}
              placeholder={exampleEmail}
              autoComplete="email"
              cannotError
              onChange={event => onEmailChange(event.target.value)}
            />
            {error && (
              <ErrorRow>
                <ExclamationIcon
                  label={t('partner_landing.error_icon_label')}
                  width={16}
                  color={theme.color.text.error}
                />
                <ErrorText>{error}</ErrorText>
              </ErrorRow>
            )}
            <SubmitButton
              type="submit"
              size={ButtonSizes.Stretch}
              loading={isSubmitting}
            >
              {t('partner_landing.submit')}
            </SubmitButton>
            <Microcopy>{t('partner_landing.microcopy')}</Microcopy>
          </FormStack>

          <NewsletterRow htmlFor={`${inputId}-newsletter`}>
            <NewsletterCheckbox
              id={`${inputId}-newsletter`}
              checked={newsletter}
              required={false}
              color={theme.color.surface.highlight}
              onCheckedChange={value => onNewsletterChange(value === true)}
            />
            <NewsletterLabel>{t('partner_landing.newsletter')}</NewsletterLabel>
          </NewsletterRow>
        </>
      )}

      <SupportRow>
        <MailIcon
          label={t('partner_landing.support_icon_label')}
          width={16}
          color={theme.color.text.tertiary}
        />
        <SupportText>
          {t('partner_landing.support_prompt')}{' '}
          <Link href={`mailto:${SUPPORT_EMAIL}`} textType={TextTypes.Body6}>
            {SUPPORT_EMAIL}
          </Link>
        </SupportText>
      </SupportRow>
    </CardShell>
  );
};

export default PartnerSignUpCard;
