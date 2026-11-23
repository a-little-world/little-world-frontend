import { useEffect, useId, useState } from 'react';

import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  CalendarAddIcon,
  CalendarIcon,
  ConfettiImage,
  DownloadIcon,
  HeartIcon,
  Modal,
  Text,
  TextTypes,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { COMMUNITY_EVENT_FREQUENCIES } from '../../../constants/index';
import { CalendarEvent } from '../../../helpers/events';
import useSystemModalBlocker from '../../../hooks/useSystemModalBlocker';
import {
  downloadIcsFile,
  generateGoogleCalendarUrl,
  generateOutlookCalendarUrl,
} from '../../atoms/AddToCalendarButton';
import CalendarOptions from '../CalendarOptions/CalendarOptions';
import {
  Actions,
  Badge,
  CalendarBlock,
  CalendarLabel,
  CancelBox,
  Card,
  CommitCheckbox,
  CommitRow,
  CommitText,
  Confirmed,
  DoorHeader,
  ErrorText,
  HeaderCopy,
  InfoBox,
  Kicker,
  When,
} from './AdventDoorDialog.styles';
import { AdventDoor, longDate, weekdayName } from './doors';

export type DialogStep = 'commit' | 'confirmed' | 'cancel';

type BookResult = 'booked' | 'full';

type Props = {
  door: AdventDoor | null;
  step: DialogStep;
  onStep: (step: DialogStep) => void;
  onClose: () => void;
  onBook: (door: AdventDoor) => Promise<BookResult>;
  onCancelBooking: (door: AdventDoor) => Promise<void>;
};

const AdventDoorDialog = ({
  door,
  step,
  onStep,
  onClose,
  onBook,
  onCancelBooking,
}: Props) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const blockerId = useId();
  const [accepted, setAccepted] = useState(false);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const open = door !== null;

  useSystemModalBlocker(open, blockerId);

  // The dialog stays mounted between doors, so every opening starts clean.
  useEffect(() => {
    setAccepted(false);
    setError('');
    setBusy(false);
  }, [door?.id, step, open]);

  if (!door) return null;

  const when = t('advent_doors.when', {
    weekday: weekdayName(door, i18n.language),
    date: longDate(door, i18n.language),
    start: door.startTime,
    end: door.endTime,
  });
  const join =
    typeof window === 'undefined'
      ? door.joinPath
      : `${window.location.origin}${door.joinPath}`;
  const startDate = new Date(door.startsAt);
  const endDate = new Date(door.endsAt);
  const calendarEvent: CalendarEvent = {
    frequency: COMMUNITY_EVENT_FREQUENCIES.once,
    title: t('advent_doors.event_title', { company: door.company }),
    description: t('advent_doors.event_details', {
      company: door.company,
      join,
    }),
    startDate,
    endDate,
    durationInMinutes: Math.round(
      (endDate.getTime() - startDate.getTime()) / 60000,
    ),
    link: join,
  };

  const confirm = async () => {
    if (!accepted || busy) return;
    setBusy(true);
    setError('');
    try {
      const result = await onBook(door);
      if (result === 'full') {
        setError(t('advent_doors.full_error'));
        return;
      }
      onStep('confirmed');
    } catch {
      setError(t('advent_doors.generic_error'));
    } finally {
      setBusy(false);
    }
  };

  const cancel = async () => {
    if (busy) return;
    setBusy(true);
    setError('');
    try {
      await onCancelBooking(door);
      onClose();
    } catch {
      setError(t('advent_doors.generic_error'));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Card>
        {step !== 'confirmed' && (
          <DoorHeader>
            <Badge aria-hidden="true">{door.day}</Badge>
            <HeaderCopy>
              <Kicker>
                {t('advent_doors.door_kicker', { day: door.day })}
              </Kicker>
              <Text type={TextTypes.Heading5} tag="h3">
                {door.company}
              </Text>
              <When>{when}</When>
            </HeaderCopy>
          </DoorHeader>
        )}
        {step === 'commit' && (
          <>
            <InfoBox>
              <HeartIcon label="" width="20" height="20" color="currentColor" />
              <Text>
                {t('advent_doors.commit_info', { company: door.company })}
              </Text>
            </InfoBox>
            <CommitRow htmlFor={`${blockerId}-commit`}>
              <CommitCheckbox
                id={`${blockerId}-commit`}
                checked={accepted}
                required={false}
                onCheckedChange={value => setAccepted(value === true)}
              />
              <CommitText>
                {t('advent_doors.commit_label', {
                  day: door.day,
                  startTime: door.startTime,
                })}
              </CommitText>
            </CommitRow>
            {error && <ErrorText>{error}</ErrorText>}
            <Actions>
              <Button
                appearance={ButtonAppearance.Primary}
                size={ButtonSizes.Medium}
                disabled={!accepted || busy}
                onClick={confirm}
              >
                {t('advent_doors.confirm')}
              </Button>
              <Button variation={ButtonVariations.Inline} onClick={onClose}>
                {t('advent_doors.abort')}
              </Button>
            </Actions>
          </>
        )}
        {step === 'confirmed' && (
          <>
            <Confirmed>
              <ConfettiImage label="" width={120} height={120} />
              <Text type={TextTypes.Heading4} tag="h2">
                {t('advent_doors.confirmed_title')}
              </Text>
              <Text>
                {t('advent_doors.confirmed_body', {
                  company: door.company,
                  when,
                })}
              </Text>
            </Confirmed>
            <CalendarBlock>
              <CalendarLabel>{t('advent_doors.calendar_label')}</CalendarLabel>
              <CalendarOptions
                size="compact"
                options={[
                  {
                    key: 'google',
                    title: t('advent_doors.google'),
                    Icon: CalendarIcon,
                    onClick: () =>
                      window.open(
                        generateGoogleCalendarUrl(calendarEvent),
                        '_blank',
                        'noopener',
                      ),
                  },
                  {
                    key: 'outlook',
                    title: t('advent_doors.outlook'),
                    Icon: CalendarAddIcon,
                    onClick: () =>
                      window.open(
                        generateOutlookCalendarUrl(calendarEvent),
                        '_blank',
                        'noopener',
                      ),
                  },
                  {
                    key: 'apple',
                    title: t('advent_doors.apple'),
                    Icon: DownloadIcon,
                    onClick: () => downloadIcsFile(calendarEvent),
                  },
                ]}
              />
            </CalendarBlock>
            <CancelBox>
              <Text>
                <strong>{t('advent_doors.cancel_prompt')}</strong>{' '}
                {t('advent_doors.cancel_hint')}
              </Text>
              <Button
                appearance={ButtonAppearance.Secondary}
                size={ButtonSizes.Small}
                onClick={() => onStep('cancel')}
              >
                {t('advent_doors.cancel_time')}
              </Button>
            </CancelBox>
            <Actions>
              <Button
                appearance={ButtonAppearance.Primary}
                size={ButtonSizes.Stretch}
                onClick={onClose}
              >
                {t('advent_doors.done')}
              </Button>
            </Actions>
          </>
        )}
        {step === 'cancel' && (
          <>
            <Text type={TextTypes.Heading4} tag="h2">
              {t('advent_doors.cancel_title')}
            </Text>
            <Text>
              {t('advent_doors.cancel_body', { company: door.company })}
            </Text>
            {error && <ErrorText>{error}</ErrorText>}
            <Actions>
              <Button
                appearance={ButtonAppearance.Secondary}
                size={ButtonSizes.Medium}
                disabled={busy}
                onClick={cancel}
                color={theme.color.text.error}
              >
                {t('advent_doors.cancel_yes')}
              </Button>
              <Button
                variation={ButtonVariations.Inline}
                onClick={onClose}
                color={theme.color.text.link}
              >
                {t('advent_doors.stay')}
              </Button>
            </Actions>
          </>
        )}
      </Card>
    </Modal>
  );
};

export default AdventDoorDialog;
