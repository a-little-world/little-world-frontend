import {
  ComponentType,
  FormEvent,
  RefObject,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import {
  ButtonAppearance,
  ButtonSizes,
  ClockIcon,
  CustomThemeProvider,
  ExclamationIcon,
  HeartIcon,
  InclusiveIcon,
  InfoIcon,
  Loading,
  LoadingSizes,
  MailIcon,
  MessageIcon,
  MicIcon,
  Modal,
  PhoneIcon,
  PhoneSlashIcon,
  ProfileIcon,
  QuestionIcon,
  Tag,
  TagAppearance,
  TagSizes,
  Text,
  TextInput,
  ThemeVariants,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  getPartnerLandingEndpoint,
  getRandomCallLobbyEndpoint,
  USER_ENDPOINT,
} from '../../../api/endpoints';
import { exitLobby } from '../../../api/randomCalls';
import { LANGUAGES } from '../../../constants/index';
import {
  formatDate,
  formatTime,
  formatTimeRange,
  toTimeZone,
} from '../../../helpers/date';
import useSystemModalBlocker from '../../../hooks/useSystemModalBlocker';
import { getAdventGuestAfterCallRoute } from '../../../router/routes';
import Header from '../../blocks/Header';
import PageFooter from '../../blocks/PageFooter/PageFooter';
import {
  DoorBadge,
  DoorKnob,
  DoorNumber,
} from '../../blocks/PartnerSignUpCard/PartnerSignUpCard.styles';
import RandomCallsLobby from '../../blocks/RandomCalls/RandomCallsLobby';
import {
  BannerCopy,
  CardTitle,
  Content,
  EqualCard,
  Footnote,
  IconCopy,
  IconList,
  IconRow,
  IconSlot,
  InfoBanner,
  LobbyBody,
  LobbyCard,
  LobbyDoorScale,
  LobbyDoorSlot,
  LobbyLead,
  LobbyTitle,
  MainRow,
  NameBlock,
  NameError,
  NameForm,
  NameHint,
  Page,
  RowText,
  SecondaryIntro,
  SecondRow,
  SideStack,
  StackCard,
  StartButton,
  StatusDot,
  StatusLabel,
  StatusPane,
  StatusRow,
  Step,
  StepBody,
  StepCopy,
  StepList,
  StepNumber,
  StepTitle,
  TileText,
  TileTitle,
  TimeSlot,
  VideoTile,
  VideoTiles,
} from './ExternalRandomCallsPortal.styles';
import {
  ExternalGuestSession,
  lobbyIsActive,
  RandomCallLobbyDetails,
  readGuestFirstName,
  saveGuestFirstName,
  sessionFromLobby,
  SignedInGuest,
} from './guestSession';
import SessionUserChip from './SessionUserChip';

const ICON_SIZE = 20;

const STEPS = ['start', 'connect', 'talk'] as const;
const TIPS = [
  { key: 'pace', Icon: MessageIcon },
  { key: 'correct', Icon: HeartIcon },
  { key: 'topics', Icon: QuestionIcon },
  { key: 'equal', Icon: InclusiveIcon },
  { key: 'stop', Icon: ExclamationIcon },
] as const;

type PortalProps = {
  session: ExternalGuestSession;
};

type LobbyIcon = ComponentType<{
  label: string;
  width?: number;
  height?: number;
  color?: string;
}>;

const MutedIcon = ({ icon: Icon }: { icon: LobbyIcon }) => {
  const theme = useTheme();

  return (
    <IconSlot>
      <Icon
        label=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        color={theme.color.text.primary}
      />
    </IconSlot>
  );
};

const ExternalRandomCallsPage = ({ session }: PortalProps) => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const { lobbyId } = useParams<{ lobbyId?: string }>();
  const location = useLocation();
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);
  const recordName = session.firstName?.trim() ?? '';
  const [savedName, setSavedName] = useState(
    () => recordName || readGuestFirstName(lobbyId),
  );
  const [draftName, setDraftName] = useState('');
  const [nameError, setNameError] = useState<string | null>(null);
  const [lobbyOpen, setLobbyOpen] = useState(false);
  const [lobbySessionKey, setLobbySessionKey] = useState(0);

  const [now, setNow] = useState(() => new Date());
  const startsAt = toTimeZone(session.startsAt, session.timeZone);
  const endsAt = toTimeZone(session.endsAt, session.timeZone);
  const lobbyActive = lobbyIsActive(session.startsAt, session.endsAt, now);
  const windowEnded = now.getTime() > session.endsAt.getTime();
  let statusKey = 'external_random_calls.status_upcoming';
  if (lobbyActive) statusKey = 'external_random_calls.status_open';
  if (windowEnded) statusKey = 'external_random_calls.status_closed';
  const eventDate = formatDate(startsAt, 'd. MMMM', i18n.language);
  const weekday = formatDate(startsAt, 'EEEEEE', i18n.language);
  const displayedName = savedName;

  useEffect(() => {
    setSavedName(recordName || readGuestFirstName(lobbyId));
    setDraftName('');
    setNameError(null);
  }, [recordName, lobbyId]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const previousTitle = document.title;
    document.title = t('external_random_calls.page_title');
    return () => {
      document.title = previousTitle;
    };
  }, [t]);

  useEffect(() => {
    const state = location.state as { openLobby?: boolean } | null;
    if (!state?.openLobby) return;
    setLobbySessionKey(current => current + 1);
    setLobbyOpen(true);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate]);

  useSystemModalBlocker(lobbyOpen, 'external-random-calls');

  const openLobbyFresh = () => {
    setLobbySessionKey(current => current + 1);
    setLobbyOpen(true);
  };

  const onCloseLobby = async () => {
    setLobbyOpen(false);
    try {
      await exitLobby(session.lobbyUuid);
    } catch {
      // Leaving before a join is recorded is expected.
    }
  };

  const handleStart = (event?: FormEvent) => {
    event?.preventDefault();
    const name = (displayedName || draftName).trim();
    if (!name) {
      setNameError(t('external_random_calls.name_error'));
      inputRef.current?.focus();
      return;
    }

    setNameError(null);
    setSavedName(name);
    saveGuestFirstName(lobbyId, name);
    openLobbyFresh();
  };

  return (
    <Page>
      <Modal
        open={lobbyOpen}
        onClose={onCloseLobby}
        closeOnBackdropClick={false}
      >
        <RandomCallsLobby
          key={`${session.lobbyUuid}-${lobbySessionKey}`}
          lobbyUuid={session.lobbyUuid}
          onCancel={onCloseLobby}
          activeUsersCount={session.activeUsersCount}
          exitPath={lobbyId ? getAdventGuestAfterCallRoute(lobbyId) : undefined}
        />
      </Modal>
      <Header
        logoLinksOut={false}
        endSlot={
          <SessionUserChip
            partnerName={session.partnerName}
            firstName={displayedName}
            isGuest={session.isGuest}
          />
        }
      />
      <Content>
        <InfoBanner>
          <MutedIcon icon={InfoIcon} />
          <BannerCopy>
            {t('external_random_calls.banner', { date: eventDate })}
          </BannerCopy>
        </InfoBanner>

        <MainRow>
          <LobbyCard>
            <LobbyDoorSlot>
              <LobbyDoorScale>
                <DoorBadge>
                  <DoorNumber>{startsAt.getDate()}</DoorNumber>
                  <DoorKnob />
                </DoorBadge>
              </LobbyDoorScale>
            </LobbyDoorSlot>
            <LobbyBody>
              <LobbyTitle>{t('external_random_calls.title')}</LobbyTitle>
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
                {lobbyActive ? (
                  <StartButton
                    type="submit"
                    appearance={ButtonAppearance.Primary}
                    size={ButtonSizes.Medium}
                  >
                    <PhoneIcon
                      label=""
                      width={18}
                      height={18}
                      color={theme.color.text.button}
                    />
                    {t('external_random_calls.start')}
                  </StartButton>
                ) : null}
              </NameForm>
            </LobbyBody>
          </LobbyCard>

          <SideStack>
            <StackCard>
              <CardTitle>{t('external_random_calls.how_title')}</CardTitle>
              <StepList>
                {STEPS.map((key, index) => (
                  <Step key={key}>
                    <StepNumber>{index + 1}</StepNumber>
                    <StepCopy>
                      <StepTitle>
                        {t(`external_random_calls.step_${key}_title`)}
                      </StepTitle>
                      <StepBody>
                        {t(`external_random_calls.step_${key}_body`)}
                      </StepBody>
                    </StepCopy>
                  </Step>
                ))}
              </StepList>
            </StackCard>

            <StackCard>
              <CardTitle>{t('external_random_calls.access_title')}</CardTitle>
              <IconList>
                {session.email ? (
                  <IconRow>
                    <MutedIcon icon={MailIcon} />
                    <IconCopy>
                      <RowText disableParser>{session.email}</RowText>
                      <Tag
                        appearance={TagAppearance.success}
                        size={TagSizes.small}
                        bold
                      >
                        {t('external_random_calls.confirmed')}
                      </Tag>
                    </IconCopy>
                  </IconRow>
                ) : null}
                <IconRow>
                  <MutedIcon icon={ClockIcon} />
                  <RowText>
                    {t('external_random_calls.valid_until', {
                      date: eventDate,
                      time: formatTimeRange(startsAt, endsAt),
                    })}
                  </RowText>
                </IconRow>
                <IconRow>
                  <MutedIcon icon={ProfileIcon} />
                  <RowText>
                    {t('external_random_calls.first_name_only')}
                  </RowText>
                </IconRow>
              </IconList>
            </StackCard>
          </SideStack>
        </MainRow>

        <SecondRow>
          <EqualCard>
            <CardTitle>{t('external_random_calls.handbook_title')}</CardTitle>
            <SecondaryIntro>
              {t('external_random_calls.handbook_intro')}
            </SecondaryIntro>
            <IconList>
              {TIPS.map(({ key, Icon }) => (
                <IconRow key={key}>
                  <MutedIcon icon={Icon} />
                  <RowText>{t(`external_random_calls.tip_${key}`)}</RowText>
                </IconRow>
              ))}
            </IconList>
          </EqualCard>

          <EqualCard>
            <CardTitle>{t('external_random_calls.video_title')}</CardTitle>
            <VideoTiles>
              <VideoTile>
                <MutedIcon icon={MicIcon} />
                <TileTitle>{t('external_random_calls.mic_title')}</TileTitle>
                <TileText>{t('external_random_calls.mic_body')}</TileText>
              </VideoTile>
              <VideoTile>
                <MutedIcon icon={VideoIcon} />
                <TileTitle>{t('external_random_calls.camera_title')}</TileTitle>
                <TileText>{t('external_random_calls.camera_body')}</TileText>
              </VideoTile>
            </VideoTiles>
            <IconList>
              <IconRow>
                <MutedIcon icon={ClockIcon} />
                <RowText>{t('external_random_calls.timer')}</RowText>
              </IconRow>
              <IconRow>
                <MutedIcon icon={PhoneSlashIcon} />
                <RowText>{t('external_random_calls.leave')}</RowText>
              </IconRow>
            </IconList>
            <Footnote>{t('external_random_calls.footnote')}</Footnote>
          </EqualCard>
        </SecondRow>
      </Content>

      <PageFooter />
    </Page>
  );
};

const partnerSlugForLobby = (name?: string | null) =>
  name && name !== 'default' && name !== 'advents-gespraeche'
    ? name
    : undefined;

const GuestPortalLoader = () => {
  const { t } = useTranslation();
  const { lobbyId } = useParams<{ lobbyId?: string }>();
  const {
    data: lobby,
    error,
    isLoading,
  } = useSWR<RandomCallLobbyDetails>(
    lobbyId ? getRandomCallLobbyEndpoint(lobbyId) : null,
  );
  const { data: user, isLoading: userLoading } = useSWR<SignedInGuest>(
    lobby ? USER_ENDPOINT : null,
  );
  const partnerSlug = partnerSlugForLobby(lobby?.name);
  const { data: partner } = useSWR<{ name?: string | null }>(
    partnerSlug ? getPartnerLandingEndpoint(partnerSlug) : null,
  );

  // Wait for the account too, so a signed-in user never shows as a guest.
  // Signed out, the user request fails quickly and the page renders.
  if (isLoading || userLoading) {
    return (
      <Page>
        <StatusPane>
          <Loading size={LoadingSizes.Medium} />
        </StatusPane>
      </Page>
    );
  }

  if (error || !lobby?.start_time || !lobby.end_time) {
    return (
      <Page>
        <Header logoLinksOut={false} />
        <StatusPane>
          <Text>{t('external_random_calls.unavailable')}</Text>
        </StatusPane>
      </Page>
    );
  }

  return (
    <ExternalRandomCallsPage
      session={sessionFromLobby(lobby, user, partner?.name)}
    />
  );
};

const ExternalRandomCallsPortal = () => {
  const { i18n } = useTranslation();
  const germanI18n = useMemo(
    () => i18n.cloneInstance({ lng: LANGUAGES.de }),
    [i18n],
  );

  return (
    <I18nextProvider i18n={germanI18n}>
      <CustomThemeProvider
        defaultMode={ThemeVariants.light}
        enableDarkMode={false}
      >
        <GuestPortalLoader />
      </CustomThemeProvider>
    </I18nextProvider>
  );
};

export default ExternalRandomCallsPortal;
