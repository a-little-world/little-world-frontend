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
  ExclamationIcon,
  LivingRoomImage,
  MatchSearchingImage,
  Modal,
  PhoneIcon,
  ProfileIcon,
  Text,
} from '@a-little-world/little-world-design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
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
import { OnlineCircle } from '../../atoms/OnlineIndicator';
import { Pill, Pills } from '../../atoms/Pills';
import ModalCard from '../../blocks/Cards/ModalCard';
import Header from '../../blocks/Header';
import { REPORT_TYPE_USER } from '../../blocks/ReportForm/constants';
import ReportForm, { ReportFormData } from '../../blocks/ReportForm/ReportForm';
import {
  isDesignPreview,
  lobbyIsActive,
  PREVIEW_FIRST_NAME,
  previewCallCount,
  previewCalls,
  previewLobby,
  previewWindowClosed,
  RandomCallLobbyDetails,
  readGuestCallSummary,
  readGuestFirstName,
  SignedInGuest,
} from '../ExternalRandomCalls/guestSession';
import SessionUserChip from '../ExternalRandomCalls/SessionUserChip';
import { PARTNER_EVENT_TIME_ZONE } from '../PartnerLanding/constants';
import {
  CardBody,
  CardButton,
  CardCopy,
  CardIntro,
  Cards,
  CardTitle,
  Column,
  IllustrationSlot,
  OptionCard,
  Page,
  ReportRow,
  Title,
  WindowStatus,
} from './AfterRandomCall.styles';

type ReportState = 'closed' | 'form' | 'confirmed';

/**
 * Which flow the call came from. It is fixed by the route, not by who is
 * signed in: a learner who joined an Advent door is in the advent flow too.
 */
export type AfterCallFlow = 'advent' | 'app';

type AfterCallProps = { flow?: AfterCallFlow };

export const AfterCallScreen = ({ flow = 'app' }: AfterCallProps) => {
  const { t } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { lobbyId = '' } = useParams<{ lobbyId: string }>();
  const [searchParams] = useSearchParams();
  const preview = isDesignPreview(lobbyId);
  const previewSearch = searchParams.toString();
  const summary = useMemo(() => {
    if (preview)
      return previewCalls(previewCallCount(previewSearch))[0] ?? null;
    return readGuestCallSummary(lobbyId);
  }, [lobbyId, preview, previewSearch]);
  const disconnectedFromUser = useConnectedCallStore(
    state => state.disconnectedFromUser,
  );
  const { data: user, isLoading: userLoading } = useSWR<SignedInGuest>(
    preview ? null : USER_ENDPOINT,
  );
  const { data: fetchedLobby } = useSWR<RandomCallLobbyDetails>(
    !preview && lobbyId ? getRandomCallLobbyEndpoint(lobbyId) : null,
  );
  const lobby = preview
    ? previewLobby(previewWindowClosed(previewSearch))
    : fetchedLobby;
  const [now, setNow] = useState(() => new Date());
  const [reportState, setReportState] = useState<ReportState>('closed');
  const sawOpenWindow = useRef(false);

  let firstName = user?.profile?.first_name?.trim() || '';
  if (preview) firstName = PREVIEW_FIRST_NAME;
  else firstName = firstName || readGuestFirstName(lobbyId);
  const advent = flow === 'advent';
  // A real account, not a guest and not a temporary one. Unknown while loading.
  const hasAccount = !preview && !!user && user.isTemporary !== true;
  const accountKnown = preview || !userLoading;
  const logoTo = hasAccount ? getAppRoute() : undefined;
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
    ? formatTime(advent ? toTimeZone(endsAt, PARTNER_EVENT_TIME_ZONE) : endsAt)
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

  // Where "end" leads. The stay page offers a guest an account, so someone
  // who already has one goes back to the app instead.
  let endPath = getAppRoute(RANDOM_CALLS_ROUTE);
  if (advent) {
    endPath = hasAccount ? getAppRoute() : getAdventGuestStayRoute(lobbyId);
  }

  useEffect(() => {
    if (
      preview ||
      !windowKnown ||
      windowOpen ||
      !lobbyId ||
      leftLobby.current ||
      // Wait for the account so the redirect below goes to the right place.
      (advent && !accountKnown)
    ) {
      return;
    }
    leftLobby.current = true;
    exitLobby(lobbyId).catch(() => {
      // The guest may already have left the lobby with the call.
    });
    if (advent && sawOpenWindow.current) navigate(endPath);
  }, [
    accountKnown,
    advent,
    endPath,
    lobbyId,
    navigate,
    preview,
    windowKnown,
    windowOpen,
  ]);

  const returnToLobby = () => {
    const path = advent
      ? getAdventGuestLobbyRoute(lobbyId)
      : getAppRoute(RANDOM_CALLS_ROUTE);
    navigate(path, { state: { openLobby: true } });
  };

  const endSession = () => {
    if (!preview) exitLobby(lobbyId).catch(() => undefined);
    navigate(endPath);
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
            <CardHeader marginBottom="0">
              {t('random_calls.report_confirmed_title')}
            </CardHeader>
            <CardContent>
              <Text center>
                {t('random_calls.report_confirmed_description')}
              </Text>
            </CardContent>
          </ModalCard>
        )}
      </Modal>
      <Header
        logoLinksOut={false}
        logoTo={logoTo}
        endSlot={
          // Wait for the account so a signed-in user never flashes as a guest.
          accountKnown ? (
            <SessionUserChip firstName={firstName} isGuest={!hasAccount} />
          ) : null
        }
      />
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
            {windowOpen && <OnlineCircle />}
            {t(windowStatusKey, { time: endLabel })}
          </WindowStatus>
        ) : null}
        <Cards>
          {windowOpen ? (
            <OptionCard $recommended>
              <CardIntro>
                <IllustrationSlot>
                  <MatchSearchingImage label="" width={120} height={120} />
                </IllustrationSlot>
                <CardCopy>
                  <CardTitle>
                    {t('external_random_calls.after.again_title')}
                  </CardTitle>
                  <CardBody>
                    {t('external_random_calls.after.again_body')}
                  </CardBody>
                </CardCopy>
              </CardIntro>
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
            <CardIntro>
              <IllustrationSlot>
                <LivingRoomImage label="" width={120} height={120} />
              </IllustrationSlot>
              <CardCopy>
                <CardTitle>
                  {t('external_random_calls.after.enough_title')}
                </CardTitle>
                <CardBody>
                  {t('external_random_calls.after.enough_body')}
                </CardBody>
              </CardCopy>
            </CardIntro>
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
          <Text>{t('external_random_calls.after.problem')}</Text>
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

/** Always German. The theme comes from Root, so dark mode follows the user. */
const AfterRandomCall = ({ flow = 'app' }: AfterCallProps) => {
  const { i18n } = useTranslation();
  const germanI18n = useMemo(
    () => i18n.cloneInstance({ lng: LANGUAGES.de }),
    [i18n],
  );

  return (
    <I18nextProvider i18n={germanI18n}>
      <AfterCallScreen flow={flow} />
    </I18nextProvider>
  );
};

export default AfterRandomCall;
