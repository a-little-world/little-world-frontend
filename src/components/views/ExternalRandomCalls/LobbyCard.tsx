import { FormEvent, RefObject, useEffect, useRef, useState } from 'react';

import {
  ButtonAppearance,
  ButtonSizes,
  PhoneIcon,
  TextInput,
} from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useTheme } from 'styled-components';

import { formatDate, formatTime, toTimeZone } from '../../../helpers/date';
import {
  DoorBadge,
  DoorKnob,
  DoorNumber,
} from '../../blocks/PartnerSignUpCard/PartnerSignUpCard.styles';
import {
  LobbyBody,
  LobbyCardShell,
  LobbyDoorSlot,
  LobbyLead,
  LobbyTitle,
  NameBlock,
  NameError,
  NameForm,
  NameHint,
  StartButton,
  StatusDot,
  StatusLabel,
  StatusRow,
  TimeSlot,
} from './ExternalRandomCallsPortal.styles';
import { lobbyIsActive } from './guestSession';

type LobbyCardProps = {
  isGuest: boolean;
  startsAt: Date;
  endsAt: Date;
  timeZone: string;
  savedName?: string;
  onStart: (name: string) => void;
};

const LobbyCard = ({
  isGuest,
  startsAt: startsAtRaw,
  endsAt: endsAtRaw,
  timeZone,
  savedName = '',
  onStart,
}: LobbyCardProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const inputRef = useRef<HTMLInputElement>(null);
  const [draftName, setDraftName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [now, setNow] = useState(() => new Date());

  const startsAt = toTimeZone(startsAtRaw, timeZone);
  const endsAt = toTimeZone(endsAtRaw, timeZone);
  const lobbyActive = lobbyIsActive(startsAtRaw, endsAtRaw, now);
  const windowEnded = now.getTime() > endsAtRaw.getTime();
  let statusKey = 'external_random_calls.status_upcoming';
  if (lobbyActive) statusKey = 'external_random_calls.status_open';
  if (windowEnded) statusKey = 'external_random_calls.status_closed';
  const eventDate = formatDate(startsAt, 'd. MMMM', i18n.language);
  const weekday = formatDate(startsAt, 'EEEEEE', i18n.language);
  const displayedName = savedName.trim();

  useEffect(() => {
    setDraftName('');
    setNameError(null);
  }, [displayedName]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  const handleStart = (event?: FormEvent) => {
    event?.preventDefault();
    if (!isGuest) {
      onStart(displayedName);
      return;
    }
    const name = (displayedName || draftName).trim();
    if (!name) {
      setNameError(t('external_random_calls.name_error'));
      inputRef.current?.focus();
      return;
    }
    setNameError(null);
    onStart(name);
  };

  const startButton = (type: 'submit' | 'button') =>
    lobbyActive ? (
      <StartButton
        type={type}
        appearance={ButtonAppearance.Primary}
        size={ButtonSizes.Medium}
        onClick={type === 'button' ? () => handleStart() : undefined}
      >
        <PhoneIcon
          label=""
          width={18}
          height={18}
          color={theme.color.text.button}
        />
        {t('external_random_calls.start')}
      </StartButton>
    ) : null;

  return (
    <LobbyCardShell>
      <LobbyDoorSlot>
        <DoorBadge>
          <DoorNumber>{startsAt.getDate()}</DoorNumber>
          <DoorKnob />
        </DoorBadge>
        <LobbyTitle>{t('external_random_calls.title')}</LobbyTitle>
      </LobbyDoorSlot>
      <LobbyBody>
        <LobbyLead>{t('external_random_calls.lead')}</LobbyLead>
        <TimeSlot>
          {t('external_random_calls.slot', {
            weekday,
            date: eventDate,
            start: formatTime(startsAt),
            end: formatTime(endsAt),
          })}
        </TimeSlot>
        <StatusRow>
          <StatusDot $open={lobbyActive} />
          <StatusLabel $open={lobbyActive}>{t(statusKey)}</StatusLabel>
        </StatusRow>
        {isGuest ? (
          <NameForm onSubmit={handleStart}>
            {lobbyActive && !displayedName ? (
              <NameBlock>
                <TextInput
                  id="guest-first-name"
                  inputRef={inputRef as RefObject<HTMLInputElement>}
                  label={t('external_random_calls.name_label')}
                  placeholder={t('external_random_calls.name_placeholder')}
                  value={draftName}
                  autoComplete="given-name"
                  cannotError
                  aria-invalid={nameError ? true : undefined}
                  aria-describedby={
                    nameError ? 'guest-first-name-error' : undefined
                  }
                  onChange={event => {
                    setDraftName(event.target.value);
                    if (nameError) setNameError(null);
                  }}
                />
                <NameHint>{t('external_random_calls.name_hint')}</NameHint>
              </NameBlock>
            ) : null}
            {nameError ? (
              <NameError id="guest-first-name-error">{nameError}</NameError>
            ) : null}
            {startButton('submit')}
          </NameForm>
        ) : (
          startButton('button')
        )}
      </LobbyBody>
    </LobbyCardShell>
  );
};

export default LobbyCard;
