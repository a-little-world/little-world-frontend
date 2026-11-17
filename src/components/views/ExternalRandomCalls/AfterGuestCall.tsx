import { useEffect, useMemo, useRef, useState } from 'react';

import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  CardContent,
  CardHeader,
  CardSizes,
  ClockIcon,
  CustomThemeProvider,
  ExclamationIcon,
  LivingRoomImage,
  MatchSearchingImage,
  Modal,
  PhoneIcon,
  ProfileIcon,
  Text,
  ThemeVariants,
} from '@a-little-world/little-world-design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  getRandomCallLobbyEndpoint,
  USER_ENDPOINT,
} from '../../../api/endpoints';
import { reportIssue } from '../../../api/matches';
import { exitLobby } from '../../../api/randomCalls';
import { LANGUAGES } from '../../../constants/index';
import { useConnectedCallStore } from '../../../features/stores';
import { formatTime, toTimeZone } from '../../../helpers/date';
import {
  getAdventGuestLobbyRoute,
  getAdventGuestStayRoute,
  getAppRoute,
  RANDOM_CALLS_ROUTE,
} from '../../../router/routes';
import ModalCard from '../../blocks/Cards/ModalCard';
import Header from '../../blocks/Header';
import { REPORT_TYPE_USER } from '../../blocks/ReportForm/constants';
import ReportForm, { ReportFormData } from '../../blocks/ReportForm/ReportForm';
import { PARTNER_EVENT_TIME_ZONE } from '../PartnerLanding/constants';
import {
  CardBody,
  CardButton,
  Cards,
  CardTitle,
  Column,
  IllustrationSlot,
  OptionCard,
  Page,
  Pill,
  Pills,
  ReportRow,
  StatusDot,
  Title,
  WindowStatus,
} from './AfterGuestCall.styles';
import GuestChrome from './GuestChrome';
import {
  lobbyIsActive,
  RandomCallLobbyDetails,
  readGuestCallSummary,
  readGuestFirstName,
  SignedInGuest,
} from './guestSession';

type ReportState = 'closed' | 'form' | 'confirmed';

export const AfterCallScreen = ({
  chrome = 'guest',
}: {
  chrome?: 'guest' | 'app';
}) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { lobbyId = '' } = useParams<{ lobbyId: string }>();
  const summary = useMemo(() => readGuestCallSummary(lobbyId), [lobbyId]);
  const disconnectedFromUser = useConnectedCallStore(
    state => state.disconnectedFromUser,
  );
  const { data: user } = useSWR<SignedInGuest>(USER_ENDPOINT);
  const { data: lobby } = useSWR<RandomCallLobbyDetails>(
    lobbyId ? getRandomCallLobbyEndpoint(lobbyId) : null,
  );
  const [now, setNow] = useState(() => new Date());
  const [reportState, setReportState] = useState<ReportState>('closed');
  const sawOpenWindow = useRef(false);

  const firstName =
    chrome === 'guest'
      ? readGuestFirstName(lobbyId) || user?.profile?.first_name?.trim() || ''
      : user?.profile?.first_name?.trim() || '';
  const partnerName = summary?.partnerName?.trim() ?? '';
  const minutes = summary?.durationMinutes ?? 0;
  const endsAt = lobby?.end_time ? new Date(lobby.end_time) : null;
  const startsAt = lobby?.start_time ? new Date(lobby.start_time) : null;
  const windowKnown = startsAt != null && endsAt != null;
  const windowOpen = windowKnown && lobbyIsActive(startsAt, endsAt, now);
  const windowEnded = windowKnown && now.getTime() > endsAt.getTime();
  let windowStatusKey = 'external_random_calls.status_upcoming';
  if (windowOpen) windowStatusKey = 'external_random_calls.after.window_open';
  if (windowEnded) windowStatusKey = 'external_random_calls.status_closed';
  const leftLobby = useRef(false);
  const endLabel = endsAt
    ? formatTime(
        chrome === 'guest'
          ? toTimeZone(endsAt, PARTNER_EVENT_TIME_ZONE)
          : endsAt,
      )
    : '';

  useEffect(() => {
    const previousTitle = document.title;
    document.title = t('external_random_calls.after.page_title');
    return () => {
      document.title = previousTitle;
    };
  }, [t]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 15000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (windowOpen) sawOpenWindow.current = true;
  }, [windowOpen]);

  useEffect(() => {
    if (!windowKnown || windowOpen || !lobbyId || leftLobby.current) return;
    leftLobby.current = true;
    exitLobby(lobbyId).catch(() => {
      // The guest may already have left the lobby with the call.
    });
    if (chrome === 'guest' && sawOpenWindow.current) {
      navigate(getAdventGuestStayRoute(lobbyId));
    }
  }, [chrome, lobbyId, navigate, windowKnown, windowOpen]);

  const returnToLobby = () => {
    const path =
      chrome === 'guest'
        ? getAdventGuestLobbyRoute(lobbyId)
        : getAppRoute(RANDOM_CALLS_ROUTE);
    navigate(path, { state: { openLobby: true } });
  };

  const endSession = () => {
    exitLobby(lobbyId).catch(() => undefined);
    navigate(
      chrome === 'guest'
        ? getAdventGuestStayRoute(lobbyId)
        : getAppRoute(RANDOM_CALLS_ROUTE),
    );
  };

  const onSubmitReport = (
    { reason, reportType, keywords }: ReportFormData,
    onError: (error: unknown) => void,
  ) => {
    const reportedUserId = disconnectedFromUser ?? summary?.partnerId;
    reportIssue({
      reason,
      kind: reportType,
      keywords,
      origin: 'Post Random Call',
      reportedUserId: reportType === REPORT_TYPE_USER ? reportedUserId : null,
      onSuccess: () => setReportState('confirmed'),
      onError,
    });
  };

  return (
    <Page>
      <Modal
        open={reportState !== 'closed'}
        onClose={() => setReportState('closed')}
      >
        {reportState === 'form' ? (
          <ModalCard size={CardSizes.Large}>
            <CardHeader marginBottom="0">
              {t('random_calls.report_card_title')}
            </CardHeader>
            <CardContent>
              <ReportForm
                hideTitle
                onSubmit={onSubmitReport}
                onClose={() => setReportState('closed')}
              />
            </CardContent>
          </ModalCard>
        ) : (
          <ModalCard>
            <CardHeader>{t('random_calls.report_confirmed_title')}</CardHeader>
            <CardContent>
              <Text center>
                {t('random_calls.report_confirmed_description')}
              </Text>
            </CardContent>
          </ModalCard>
        )}
      </Modal>
      {chrome === 'guest' ? (
        <Header
          logoLinksOut={false}
          endSlot={<GuestChrome partnerName={null} firstName={firstName} />}
        />
      ) : null}
      <Column>
        <Title>{t('external_random_calls.after.title')}</Title>
        <Pills>
          <Pill>
            <ProfileIcon
              label=""
              width={16}
              height={16}
              color={theme.color.text.secondary}
            />
            {partnerName
              ? t('external_random_calls.after.with_partner', {
                  name: partnerName,
                })
              : t('external_random_calls.after.with_someone')}
          </Pill>
          <Pill>
            <ClockIcon
              label=""
              width={16}
              height={16}
              color={theme.color.text.secondary}
            />
            {t(
              minutes === 1
                ? 'external_random_calls.after.duration_one'
                : 'external_random_calls.after.duration_other',
              { count: minutes },
            )}
          </Pill>
        </Pills>
        {windowKnown ? (
          <WindowStatus $open={windowOpen}>
            <StatusDot $open={windowOpen} />
            {t(windowStatusKey, { time: endLabel })}
          </WindowStatus>
        ) : null}
        <Cards>
          {windowOpen ? (
            <OptionCard $recommended>
              <IllustrationSlot>
                <MatchSearchingImage label="" width={120} height={120} />
              </IllustrationSlot>
              <CardTitle>
                {t('external_random_calls.after.again_title')}
              </CardTitle>
              <CardBody>{t('external_random_calls.after.again_body')}</CardBody>
              <CardButton
                appearance={ButtonAppearance.Primary}
                size={ButtonSizes.Stretch}
                onClick={returnToLobby}
              >
                <PhoneIcon
                  label=""
                  width={18}
                  height={18}
                  color={theme.color.text.button}
                />
                {t('external_random_calls.after.again_button')}
              </CardButton>
            </OptionCard>
          ) : null}
          <OptionCard>
            <IllustrationSlot>
              <LivingRoomImage label="" width={120} height={120} />
            </IllustrationSlot>
            <CardTitle>
              {t('external_random_calls.after.enough_title')}
            </CardTitle>
            <CardBody>{t('external_random_calls.after.enough_body')}</CardBody>
            <CardButton
              appearance={ButtonAppearance.Secondary}
              size={ButtonSizes.Stretch}
              onClick={endSession}
            >
              {t('external_random_calls.after.end_button')}
            </CardButton>
          </OptionCard>
        </Cards>
        <ReportRow>
          <ExclamationIcon
            label=""
            width={16}
            height={16}
            color={theme.color.text.tertiary}
          />
          {t('external_random_calls.after.problem')}
          <Button
            variation={ButtonVariations.Inline}
            onClick={() => setReportState('form')}
            color={theme.color.text.link}
          >
            {t('external_random_calls.after.report')}
          </Button>
        </ReportRow>
      </Column>
    </Page>
  );
};

const AfterGuestCall = () => {
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
        <AfterCallScreen />
      </CustomThemeProvider>
    </I18nextProvider>
  );
};

export default AfterGuestCall;
