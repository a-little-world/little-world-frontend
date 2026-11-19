import { useEffect, useMemo, useState } from 'react';

import {
  BellIcon,
  ButtonSizes,
  CalendarAddIcon,
  ChevronRightIcon,
  ClockIcon,
  ConfettiImage,
  CopyIcon,
  DownloadIcon,
  Link,
  MailIcon,
  TextTypes,
  TickIcon,
  WebIcon,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { COMMUNITY_EVENT_FREQUENCIES } from '../../../constants/index';
import {
  calendarDaysUntil,
  formatDate,
  formatTimeRange,
  toTimeZone,
} from '../../../helpers/date';
import { CalendarEvent } from '../../../helpers/events';
import {
  downloadIcsFile,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
} from '../../atoms/AddToCalendarButton';
import { SUPPORT_EMAIL } from '../../blocks/PartnerSignUpCard/PartnerSignUpCard';
import {
  AppointmentCopy,
  AppointmentDate,
  AppointmentEyebrow,
  AppointmentRow,
  DashedDivider,
  DateLong,
  DateShort,
  DaysPill,
  DoorBadge,
  DoorKnob,
  DoorNumber,
  TimeLabel,
  TimeRow,
} from '../../blocks/PartnerSignUpCard/PartnerSignUpCard.styles';
import { PartnerEvent } from './constants';
import {
  CalendarChevron,
  CalendarList,
  CalendarOption,
  CalendarOptionCopy,
  CalendarOptionSubtitle,
  CalendarOptionTitle,
  ConfirmCard,
  ConfirmCards,
  ConfirmCardText,
  ConfirmCardTitle,
  ConfirmIntro,
  ConfirmLead,
  ConfirmPage,
  ConfirmTitle,
  CopyButton,
  InfoBar,
  InfoBarCopy,
  InfoBarSupport,
  InfoBarText,
  InfoBarWrap,
  LinkField,
  LinkRow,
  LinkValue,
} from './PartnerConfirmation.styles';

type PartnerConfirmationProps = {
  event: PartnerEvent;
  personalPath?: string | null;
};

type PartnerConfirmationIntroProps = {
  event: PartnerEvent;
  hasPersonalLink?: boolean;
};

const COPY_RESET_MS = 2500;

const CALENDAR_OPTIONS = [
  {
    key: 'google',
    Icon: CalendarAddIcon,
    open: (event: CalendarEvent) =>
      window.open(generateGoogleCalendarUrl(event), '_blank'),
  },
  {
    key: 'outlook',
    Icon: CalendarAddIcon,
    open: (event: CalendarEvent) =>
      window.open(generateOutlookCalendarUrl(event), '_blank'),
  },
  {
    key: 'ics',
    Icon: DownloadIcon,
    open: downloadIcsFile,
  },
] as const;

const displayHost = () =>
  typeof window === 'undefined'
    ? 'little-world.com'
    : window.location.host.replace(/^www\./, '');

export const PartnerConfirmationIntro = ({
  event,
  hasPersonalLink = false,
}: PartnerConfirmationIntroProps) => {
  const { t, i18n } = useTranslation();
  const startsAt = toTimeZone(event.startsAt, event.timeZone);

  return (
    <ConfirmIntro>
      <ConfettiImage
        label={t('partner_landing.success_icon_label')}
        width={130}
        height={130}
      />
      <ConfirmTitle>
        {t('partner_landing.success_title', {
          eventDate: formatDate(startsAt, 'd. MMMM', i18n.language),
        })}
      </ConfirmTitle>
      <ConfirmLead>
        {t(
          hasPersonalLink
            ? 'partner_landing.confirm.lead'
            : 'partner_landing.success_thanks',
        )}
      </ConfirmLead>
    </ConfirmIntro>
  );
};

const PartnerConfirmation = ({
  event,
  personalPath,
}: PartnerConfirmationProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const [copied, setCopied] = useState(false);
  const hasPersonalLink = Boolean(personalPath);
  const { timeZone } = event;
  const startsAt = toTimeZone(event.startsAt, timeZone);
  const endsAt = toTimeZone(event.endsAt, timeZone);
  const daysUntil = calendarDaysUntil(
    startsAt,
    toTimeZone(new Date(), timeZone),
  );
  const origin =
    typeof window === 'undefined'
      ? 'https://little-world.com'
      : window.location.origin;
  const personalUrl = hasPersonalLink ? `${origin}${personalPath}` : '';
  const displayLink = hasPersonalLink ? `${displayHost()}${personalPath}` : '';

  const calendarEvent = useMemo<CalendarEvent>(
    () => ({
      frequency: COMMUNITY_EVENT_FREQUENCIES.once,
      title: t('partner_landing.calendar.title'),
      description: hasPersonalLink
        ? t('partner_landing.calendar.description', {
            supportEmail: SUPPORT_EMAIL,
            link: personalUrl,
          })
        : t('partner_landing.calendar.description_pending', {
            supportEmail: SUPPORT_EMAIL,
          }),
      startDate: event.startsAt,
      endDate: event.endsAt,
      durationInMinutes: 30,
      link: personalUrl,
    }),
    [event.endsAt, event.startsAt, hasPersonalLink, personalUrl, t],
  );

  useEffect(() => {
    if (!copied) return undefined;
    const timeout = window.setTimeout(() => setCopied(false), COPY_RESET_MS);
    return () => window.clearTimeout(timeout);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(personalUrl);
      setCopied(true);
    } catch {
      setCopied(false);
    }
  };

  return (
    <ConfirmPage>
      <ConfirmCards>
        <ConfirmCard>
          <AppointmentRow>
            <DoorBadge>
              <DoorNumber>{event.doorNumber}</DoorNumber>
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
                    width={18}
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
          <ConfirmCardTitle>
            {t(
              hasPersonalLink
                ? 'partner_landing.confirm.link_title'
                : 'partner_landing.confirm.link_pending_title',
            )}
          </ConfirmCardTitle>
          {hasPersonalLink ? (
            <>
              <LinkRow>
                <LinkField>
                  <WebIcon
                    label={t('partner_landing.confirm.link_icon_label')}
                    width={18}
                    color={theme.color.text.primary}
                  />
                  <LinkValue>{displayLink}</LinkValue>
                </LinkField>
                <CopyButton
                  type="button"
                  $copied={copied}
                  size={ButtonSizes.Medium}
                  onClick={handleCopy}
                >
                  {copied ? (
                    <TickIcon
                      label={t('partner_landing.confirm.copied')}
                      width={18}
                      color={theme.color.text.success}
                    />
                  ) : (
                    <CopyIcon
                      label={t('partner_landing.confirm.copy')}
                      width={18}
                      color={theme.color.text.button}
                    />
                  )}
                  {copied
                    ? t('partner_landing.confirm.copied')
                    : t('partner_landing.confirm.copy')}
                </CopyButton>
              </LinkRow>
              <ConfirmCardText>
                {t('partner_landing.confirm.link_help')}
              </ConfirmCardText>
            </>
          ) : (
            <ConfirmCardText>
              {t('partner_landing.confirm.link_pending')}
            </ConfirmCardText>
          )}
        </ConfirmCard>

        <ConfirmCard>
          <ConfirmCardTitle>
            {t('partner_landing.confirm.calendar_title')}
          </ConfirmCardTitle>
          <ConfirmCardText>
            {t('partner_landing.confirm.calendar_lead')}
          </ConfirmCardText>
          <CalendarList>
            {CALENDAR_OPTIONS.map(({ key, Icon, open }) => {
              const title = t(`partner_landing.confirm.calendar_${key}`);
              return (
                <CalendarOption
                  key={key}
                  type="button"
                  onClick={() => open(calendarEvent)}
                >
                  <Icon
                    label={title}
                    width={24}
                    color={theme.color.text.primary}
                  />
                  <CalendarOptionCopy>
                    <CalendarOptionTitle>{title}</CalendarOptionTitle>
                    <CalendarOptionSubtitle>
                      {t(`partner_landing.confirm.calendar_${key}_sub`)}
                    </CalendarOptionSubtitle>
                  </CalendarOptionCopy>
                  <CalendarChevron>
                    <ChevronRightIcon
                      label={t('partner_landing.confirm.calendar_open')}
                      width={16}
                      height={16}
                    />
                  </CalendarChevron>
                </CalendarOption>
              );
            })}
          </CalendarList>
        </ConfirmCard>
      </ConfirmCards>

      <InfoBarWrap>
        <InfoBar>
          {hasPersonalLink && (
            <InfoBarCopy>
              <BellIcon
                label={t('partner_landing.confirm.email_icon_label')}
                width={22}
                color={theme.color.text.primary}
              />
              <InfoBarText>
                {t('partner_landing.confirm.email_note')}
              </InfoBarText>
            </InfoBarCopy>
          )}
          <InfoBarSupport>
            <MailIcon
              label={t('partner_landing.support_icon_label')}
              width={16}
              color={theme.color.text.tertiary}
            />
            <InfoBarText>
              {t('partner_landing.support_prompt')}{' '}
              <Link href={`mailto:${SUPPORT_EMAIL}`} textType={TextTypes.Body6}>
                {SUPPORT_EMAIL}
              </Link>
            </InfoBarText>
          </InfoBarSupport>
        </InfoBar>
      </InfoBarWrap>
    </ConfirmPage>
  );
};

export default PartnerConfirmation;
