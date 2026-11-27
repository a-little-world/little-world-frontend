import { ComponentType, useEffect, useMemo, useState } from 'react';

import {
  ClockIcon,
  CustomThemeProvider,
  ExclamationIcon,
  Gradients,
  GroupChatIcon,
  HeartIcon,
  InfoIcon,
  Loading,
  LoadingSizes,
  MailIcon,
  MessageIcon,
  MicIcon,
  Modal,
  PhoneSlashIcon,
  ProfileIcon,
  QuestionIcon,
  Tag,
  TagAppearance,
  TagSizes,
  Text,
  ThemeVariants,
  VideoIcon,
} from '@a-little-world/little-world-design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  getPartnerLandingEndpoint,
  getRandomCallLobbyEndpoint,
  USER_ENDPOINT,
} from '../../../api/endpoints';
import { exitLobby } from '../../../api/randomCalls';
import { LANGUAGES } from '../../../constants/index';
import { formatDate, formatTimeRange, toTimeZone } from '../../../helpers/date';
import useSystemModalBlocker from '../../../hooks/useSystemModalBlocker';
import {
  getAdventGuestAfterCallRoute,
  getAppExternalSessionRoute,
} from '../../../router/routes';
import Header from '../../blocks/Header';
import PageFooter from '../../blocks/PageFooter/PageFooter';
import RandomCallsLobby from '../../blocks/RandomCalls/RandomCallsLobby';
import AdventStatusPage from '../PartnerLanding/AdventStatusPage';
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
  MainRow,
  Page,
  RowText,
  SecondaryIntro,
  SecondRow,
  SideStack,
  StackCard,
  StatusPane,
  Step,
  StepBody,
  StepCopy,
  StepList,
  StepNumber,
  StepTitle,
  TileText,
  TileTitle,
  VideoTile,
  VideoTiles,
} from './ExternalRandomCallsPortal.styles';
import {
  ExternalGuestSession,
  joinsInTheApp,
  RandomCallLobbyDetails,
  readGuestFirstName,
  saveGuestFirstName,
  sessionFromLobby,
  SignedInGuest,
  useLobbyIdParam,
} from './guestSession';
import LobbyCard from './LobbyCard';
import SessionUserChip from './SessionUserChip';

const ICON_SIZE = 20;

const STEPS = ['start', 'connect', 'talk'] as const;
const TIPS = [
  { key: 'pace', Icon: MessageIcon },
  { key: 'correct', Icon: HeartIcon },
  { key: 'topics', Icon: QuestionIcon },
  { key: 'equal', Icon: GroupChatIcon },
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

const MutedIcon = ({
  icon: Icon,
  paddingTop,
}: {
  icon: LobbyIcon;
  paddingTop?: string;
}) => {
  const theme = useTheme();

  return (
    <IconSlot $paddingTop={paddingTop}>
      <Icon
        label=""
        width={ICON_SIZE}
        height={ICON_SIZE}
        color={theme.color.surface.quaternary}
      />
    </IconSlot>
  );
};

const ExternalRandomCallsPage = ({ session }: PortalProps) => {
  const { t, i18n } = useTranslation();
  const lobbyId = useLobbyIdParam();
  const location = useLocation();
  const navigate = useNavigate();
  const theme = useTheme();
  const recordName = session.firstName?.trim() ?? '';
  const [savedName, setSavedName] = useState(
    () => recordName || readGuestFirstName(lobbyId),
  );
  const [lobbyOpen, setLobbyOpen] = useState(false);
  const [lobbySessionKey, setLobbySessionKey] = useState(0);

  const startsAt = toTimeZone(session.startsAt, session.timeZone);
  const endsAt = toTimeZone(session.endsAt, session.timeZone);
  const eventDate = formatDate(startsAt, 'd. MMMM', i18n.language);
  const displayedName = savedName;

  useEffect(() => {
    setSavedName(recordName || readGuestFirstName(lobbyId));
  }, [recordName, lobbyId]);

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

  const handleStart = (name: string) => {
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
            {t(
              session.isGuest
                ? 'external_random_calls.banner'
                : 'external_random_calls.banner_account',
              { date: eventDate },
            )}
          </BannerCopy>
        </InfoBanner>

        <MainRow>
          <LobbyCard
            isGuest={session.isGuest}
            startsAt={session.startsAt}
            endsAt={session.endsAt}
            timeZone={session.timeZone}
            savedName={displayedName}
            onStart={handleStart}
          />

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
              <CardTitle>
                {t(
                  session.isGuest
                    ? 'external_random_calls.access_title'
                    : 'external_random_calls.access_title_account',
                )}
              </CardTitle>
              <IconList>
                {session.email ? (
                  <IconRow $align="center">
                    <MutedIcon
                      icon={MailIcon}
                      paddingTop={theme.spacing.xxxxsmall}
                    />
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
                  <MutedIcon
                    icon={ClockIcon}
                    paddingTop={theme.spacing.xxxsmall}
                  />
                  <RowText>
                    {t('external_random_calls.valid_until', {
                      date: eventDate,
                      time: formatTimeRange(startsAt, endsAt),
                    })}
                  </RowText>
                </IconRow>
                <IconRow>
                  <MutedIcon
                    icon={ProfileIcon}
                    paddingTop={theme.spacing.xxxsmall}
                  />
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
                  <IconSlot $paddingTop={theme.spacing.xxxsmall}>
                    <Icon
                      label=""
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                      gradient={Gradients.Blue}
                    />
                  </IconSlot>
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
                <MutedIcon
                  icon={ClockIcon}
                  paddingTop={theme.spacing.xxxsmall}
                />
                <RowText>{t('external_random_calls.timer')}</RowText>
              </IconRow>
              <IconRow>
                <MutedIcon
                  icon={PhoneSlashIcon}
                  paddingTop={theme.spacing.xxxsmall}
                />
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
  const lobbyId = useLobbyIdParam();
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
    // Signed out, the lobby is never shown: the confirmation mail is what signs a guest in.
    const signedOut = error?.status === 401 || error?.status === 403;
    return (
      <AdventStatusPage>
        <Text>
          {t(
            signedOut
              ? 'external_random_calls.sign_in_needed'
              : 'external_random_calls.unavailable',
          )}
        </Text>
      </AdventStatusPage>
    );
  }

  // An app booking opens the session in the app. A landing signup, including a learner's, stays
  // on this page.
  if (joinsInTheApp(lobby)) {
    return <Navigate to={getAppExternalSessionRoute(lobby.uuid)} replace />;
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
