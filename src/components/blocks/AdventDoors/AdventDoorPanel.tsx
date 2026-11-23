import { useMemo, useState } from 'react';

import {
  ButtonAppearance,
  ButtonSizes,
  CalendarAddIcon,
  CalendarIcon,
  ClockIcon,
  InfoIcon,
  Loading,
  LoadingSizes,
  Tag,
  TagAppearance,
  TagSizes,
  TextTypes,
  TickIcon,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';
import useSWR, { mutate } from 'swr';

import { USER_ENDPOINT } from '../../../api/endpoints';
import { USER_TYPES } from '../../../constants/index';
import { Pill } from '../../atoms/Pills';
import Garland from '../Garland/Garland';
import AdventDoorDialog, { DialogStep } from './AdventDoorDialog';
import {
  CancelLink,
  Card,
  Company,
  DayNumber,
  Divider,
  DoorButton,
  DoorCard,
  DoorCta,
  DoorFrame,
  DoorHit,
  Doors,
  Footer,
  FooterText,
  Header,
  HeaderText,
  Instruction,
  InstructionMark,
  InstructionText,
  Lead,
  LiveRegion,
  LoadingCard,
  Places,
  Spacer,
  StatusRow,
  TimeRow,
  TimeText,
  Title,
  Weekday,
} from './AdventDoorPanel.styles';
import {
  ADVENT_DOORS_KEY,
  AdventDoor,
  bookDoorRequest,
  cancelDoorRequest,
  compareDoors,
  DoorPayload,
  doorVisual,
  freeSeats,
  isFullError,
  isUpcoming,
  longDate,
  toDoor,
  toPayload,
  weekdayName,
} from './doors';

type DialogState = { id: string; step: DialogStep };

const countLabel = (
  count: number,
  t: (key: string, options?: Record<string, unknown>) => string,
) => {
  if (count === 0) return t('advent_doors.booked_none');
  if (count === 1) return t('advent_doors.booked_one');
  return t('advent_doors.booked_other', { count });
};

const AdventDoorPanel = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { data: user, isLoading: userLoading } = useSWR(USER_ENDPOINT);
  const isLearner = user?.profile?.user_type === USER_TYPES.learner;
  const { data, isLoading: doorsLoading } = useSWR<DoorPayload[]>(
    isLearner ? ADVENT_DOORS_KEY : null,
  );
  const [dialog, setDialog] = useState<DialogState | null>(null);
  const [announcement, setAnnouncement] = useState('');

  const doors = useMemo(
    () =>
      (data ?? [])
        .map(toDoor)
        .filter(door => isUpcoming(door))
        .sort(compareDoors),
    [data],
  );

  const replace = (id: string, next: DoorPayload) =>
    mutate<DoorPayload[]>(
      ADVENT_DOORS_KEY,
      current => (current ?? []).map(row => (row.id === id ? next : row)),
      { revalidate: false },
    );

  const book = async (door: AdventDoor) => {
    const previous = data?.find(row => row.id === door.id);
    await replace(door.id, {
      ...(previous ?? toPayload(door)),
      booked: door.booked + 1,
      booked_by_me: true,
    });
    try {
      const saved = await bookDoorRequest(door.id);
      await mutate<DoorPayload[]>(
        ADVENT_DOORS_KEY,
        current =>
          (current ?? []).map(row => (row.id === door.id ? saved : row)),
        { revalidate: true },
      );
      setAnnouncement(
        t('advent_doors.announced_booked', {
          day: door.day,
          company: door.company,
        }),
      );
      return 'booked' as const;
    } catch (error) {
      const full = isFullError(error);
      if (full) {
        await replace(door.id, full);
        return 'full' as const;
      }
      if (previous) await replace(door.id, previous);
      throw error;
    }
  };

  const cancel = async (door: AdventDoor) => {
    const previous = data?.find(row => row.id === door.id);
    await replace(door.id, {
      ...(previous ?? toPayload(door)),
      booked: Math.max(door.booked - 1, 0),
      booked_by_me: false,
    });
    try {
      const saved = await cancelDoorRequest(door.id);
      await mutate<DoorPayload[]>(
        ADVENT_DOORS_KEY,
        current =>
          (current ?? []).map(row => (row.id === door.id ? saved : row)),
        { revalidate: true },
      );
      setAnnouncement(
        t('advent_doors.announced_cancelled', {
          day: door.day,
          company: door.company,
        }),
      );
    } catch (error) {
      if (previous) await replace(door.id, previous);
      throw error;
    }
  };

  if (userLoading || doorsLoading) {
    return (
      <LoadingCard aria-busy="true">
        <Loading size={LoadingSizes.Medium} />
      </LoadingCard>
    );
  }
  if (!isLearner || !data || !doors.length) return null;
  const active = doors.find(door => door.id === dialog?.id) ?? null;
  const bookedCount = doors.filter(door => door.bookedByMe).length;
  const clockColor = (booked: boolean) =>
    booked ? theme.color.text.tertiary : theme.color.text.button;

  return (
    <Card>
      <LiveRegion aria-live="polite">{announcement}</LiveRegion>
      <Garland padding="32px" curvature={0.2} top="-16px" />
      <Header>
        <HeaderText>
          <Title>{t('advent_doors.title')}</Title>
          <Lead>{t('advent_doors.lead', { count: doors.length })}</Lead>
        </HeaderText>
        <Pill $tone="accent" $size="medium" $border="message">
          <CalendarIcon
            label=""
            width="16"
            height="16"
            color={theme.color.text.title}
          />
          {countLabel(bookedCount, t)}
        </Pill>
      </Header>
      <Instruction>
        <InstructionMark>
          <CalendarAddIcon
            label=""
            width="16"
            height="16"
            color={theme.color.text.title}
          />
        </InstructionMark>
        <InstructionText type={TextTypes.Body5}>
          {t('advent_doors.instruction')}
        </InstructionText>
      </Instruction>
      <Doors>
        {doors.map(door => (
          <Door
            key={door.id}
            door={door}
            language={i18n.language}
            clockColor={clockColor(door.bookedByMe)}
            onOpen={step => setDialog({ id: door.id, step })}
            t={t}
          />
        ))}
      </Doors>
      <Footer>
        <InfoIcon
          label=""
          width="16"
          height="16"
          color={theme.color.text.tertiary}
        />
        <FooterText>{t('advent_doors.footer')}</FooterText>
      </Footer>
      <AdventDoorDialog
        door={dialog ? active : null}
        step={dialog?.step ?? 'commit'}
        onStep={step =>
          setDialog(current => (current ? { ...current, step } : current))
        }
        onClose={() => setDialog(null)}
        onBook={book}
        onCancelBooking={cancel}
      />
    </Card>
  );
};

type DoorProps = {
  door: AdventDoor;
  language: string;
  clockColor: string;
  onOpen: (step: DialogStep) => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const Door = ({ door, language, clockColor, onOpen, t }: DoorProps) => {
  const state = doorVisual(door);
  const free = freeSeats(door);
  const booked = state === 'booked';
  const weekday = weekdayName(door, language);
  const spokenWhen = `${weekdayName(door, language)} ${longDate(door, language).replace(/\s+\d{4}$/, '')}`;
  let places = t('advent_doors.aria_places', { count: free });
  if (state === 'booked') places = t('advent_doors.aria_booked');
  else if (state === 'almost') {
    places = t('advent_doors.aria_almost', { count: free });
  } else if (free === 1) places = t('advent_doors.aria_places_one');
  let action = t('advent_doors.aria_action_open');
  if (state === 'booked') action = t('advent_doors.aria_action_booked');
  else if (state === 'full') action = t('advent_doors.full');
  const label = t('advent_doors.aria', {
    day: door.day,
    company: door.company,
    when: spokenWhen,
    start: door.startTime,
    end: door.endTime,
    places,
    action,
  });
  const showPlaces = !booked;
  let placesText = t('advent_doors.places_other', { count: free });
  if (free === 1) placesText = t('advent_doors.places_one');
  else if (state === 'almost') {
    placesText = t('advent_doors.almost', { count: free });
  }
  let cta = t('advent_doors.sign_up');
  if (state === 'full') cta = t('advent_doors.full');
  else if (booked) cta = t('advent_doors.attending');

  const body = (
    <>
      <DayNumber $booked={booked}>{door.day}</DayNumber>
      <Divider $booked={booked} />
      <Company>{door.company}</Company>
      <Weekday $muted={booked}>{weekday}</Weekday>
      <TimeRow $muted={booked}>
        <ClockIcon label="" width="14" height="14" color={clockColor} />
        <TimeText>
          {t('advent_doors.time', {
            start: door.startTime,
            end: door.endTime,
          })}
        </TimeText>
      </TimeRow>
      <Spacer />

      {booked ? (
        <StatusRow>
          <Tag appearance={TagAppearance.success} size={TagSizes.small} bold>
            <TickIcon label="" width="12" height="12" />
            {cta}
          </Tag>
        </StatusRow>
      ) : (
        <DoorCta
          isDummy={state !== 'full'}
          aria-hidden
          appearance={ButtonAppearance.Primary}
          size={ButtonSizes.Small}
          disabled={state === 'full'}
        >
          {cta}
        </DoorCta>
      )}
      {showPlaces && <Places>{placesText}</Places>}
    </>
  );

  if (booked) {
    return (
      <DoorFrame $state={state}>
        <DoorHit
          type="button"
          aria-label={label}
          onClick={() => onOpen('confirmed')}
        >
          {body}
        </DoorHit>
        <CancelLink type="button" onClick={() => onOpen('cancel')}>
          {t('advent_doors.cancel')}
        </CancelLink>
      </DoorFrame>
    );
  }

  if (state === 'full') {
    return <DoorCard $state={state}>{body}</DoorCard>;
  }

  return (
    <DoorButton
      type="button"
      $state={state}
      aria-label={label}
      onClick={() => onOpen(booked ? 'confirmed' : 'commit')}
    >
      {body}
    </DoorButton>
  );
};

export default AdventDoorPanel;
