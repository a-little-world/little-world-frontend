import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  ButtonAppearance,
  ButtonSizes,
  ButtonVariations,
  CalendarIcon,
  ClockIcon,
  ConfettiImage,
  CustomThemeProvider,
  MessageIcon,
  ProfileIcon,
  ThemeVariants,
  TickIcon,
} from '@a-little-world/little-world-design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';
import { useNavigate, useParams } from 'react-router-dom';
import { useTheme } from 'styled-components';
import useSWR from 'swr';

import {
  getRandomCallLobbyEndpoint,
  USER_ENDPOINT,
} from '../../../api/endpoints';
import { LANGUAGES } from '../../../constants/index';
import { formatDate, formatTime, toTimeZone } from '../../../helpers/date';
import { ADVENT_LANDING_ROUTE, SIGN_UP_ROUTE } from '../../../router/routes';
import Header from '../../blocks/Header';
import PageFooter from '../../blocks/PageFooter/PageFooter';
import { PARTNER_EVENT_TIME_ZONE } from '../PartnerLanding/constants';
import { Column, Page, Pill, Pills, Title } from './AfterGuestCall.styles';
import {
  AccountCard,
  Avatar,
  AvatarPhoto,
  Benefit,
  BenefitText,
  CallCopy,
  CallListCard,
  CallMeta,
  CallName,
  CallRow,
  CardHeading,
  Footnote,
  Goodbye,
  Illustration,
  LaterLink,
  OfferLayout,
  TickCircle,
} from './GuestAccountOffer.styles';
import GuestChrome from './GuestChrome';
import {
  GuestCallSummary,
  RandomCallLobbyDetails,
  readGuestCalls,
  readGuestFirstName,
  SignedInGuest,
} from './guestSession';

const TICK_COLOR = '#1f7a45';

const partnerSlugForLobby = (name?: string | null) =>
  name && name !== 'default' && name !== 'advents-gespraeche'
    ? name
    : undefined;

const initialFor = (name: string) => {
  const letter = name.trim().charAt(0);
  return letter ? letter.toLocaleUpperCase('de-DE') : '?';
};

const avatarTone = (seed: string): 'orange' | 'blue' => {
  const total = Array.from(seed).reduce(
    (sum, char) => sum + char.charCodeAt(0),
    0,
  );
  return total % 2 === 0 ? 'orange' : 'blue';
};

const uniqueNames = (calls: GuestCallSummary[]) =>
  calls
    .map(call => call.partnerName.trim())
    .filter((name, index, all) => name && all.indexOf(name) === index);

const contactKey = (count: number) => {
  if (count <= 1) return 'external_random_calls.offer.contact_one';
  if (count === 2) return 'external_random_calls.offer.contact_two';
  if (count === 3) return 'external_random_calls.offer.contact_three';
  return 'external_random_calls.offer.contact_more';
};

const GuestAccountOfferPage = () => {
  const { t, i18n } = useTranslation();
  const theme = useTheme();
  const navigate = useNavigate();
  const { lobbyId = '' } = useParams<{ lobbyId: string }>();
  const calls = useMemo(() => readGuestCalls(lobbyId), [lobbyId]);
  const { data: user } = useSWR<SignedInGuest>(USER_ENDPOINT);
  const { data: lobby } = useSWR<RandomCallLobbyDetails>(
    lobbyId ? getRandomCallLobbyEndpoint(lobbyId) : null,
  );
  const [later, setLater] = useState(false);

  const firstName =
    readGuestFirstName(lobbyId) || user?.profile?.first_name?.trim() || '';
  const nameSuffix = firstName ? `, ${firstName}` : '';
  const several = calls.length >= 2;
  const startsAt = lobby?.start_time ? new Date(lobby.start_time) : null;
  const endsAt = lobby?.end_time ? new Date(lobby.end_time) : null;
  const zonedStart = startsAt
    ? toTimeZone(startsAt, PARTNER_EVENT_TIME_ZONE)
    : null;
  const zonedEnd = endsAt ? toTimeZone(endsAt, PARTNER_EVENT_TIME_ZONE) : null;
  const dateLabel = zonedStart
    ? formatDate(zonedStart, 'd. MMMM', i18n.language)
    : '';
  const totalMinutes = calls.reduce(
    (sum, call) => sum + call.durationMinutes,
    0,
  );
  const names = uniqueNames(calls);
  const oneCall = calls[0];
  const durationLabel = (minutes: number) =>
    t(
      minutes === 1
        ? 'external_random_calls.after.duration_one'
        : 'external_random_calls.after.duration_other',
      { count: minutes },
    );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = t('external_random_calls.offer.page_title');
    return () => {
      document.title = previousTitle;
    };
  }, [t]);

  const homePath = partnerSlugForLobby(lobby?.name)
    ? `/${ADVENT_LANDING_ROUTE}/${partnerSlugForLobby(lobby?.name)}`
    : `/${ADVENT_LANDING_ROUTE}`;

  let headlineKey = 'external_random_calls.offer.title_none';
  if (calls.length === 1) headlineKey = 'external_random_calls.offer.title_one';
  if (several) headlineKey = 'external_random_calls.offer.title_many';

  const whenLabel =
    zonedStart && zonedEnd
      ? t(
          several
            ? 'external_random_calls.offer.when_range'
            : 'external_random_calls.offer.when_start',
          {
            date: dateLabel,
            time: formatTime(zonedStart),
            start: formatTime(zonedStart),
            end: formatTime(zonedEnd),
          },
        )
      : '';

  return (
    <Page>
      <Header
        logoLinksOut={false}
        endSlot={<GuestChrome partnerName={null} firstName={firstName} />}
      />
      <Column>
        {later ? (
          <Goodbye>
            <Title>
              {t('external_random_calls.offer.later_title', {
                name: nameSuffix,
              })}
            </Title>
            <BenefitText>
              {t('external_random_calls.offer.later_body')}
            </BenefitText>
            <Button
              appearance={ButtonAppearance.Secondary}
              onClick={() => navigate(homePath)}
            >
              {t('external_random_calls.offer.later_home')}
            </Button>
          </Goodbye>
        ) : (
          <>
            <Illustration>
              <ConfettiImage label="" width={160} height={160} />
            </Illustration>
            <Title>{t(headlineKey, { name: nameSuffix })}</Title>
            {calls.length > 0 ? (
              <Pills>
                {several ? (
                  <Pill>
                    <MessageIcon
                      label=""
                      width={16}
                      height={16}
                      color={theme.color.text.secondary}
                    />
                    {t('external_random_calls.offer.calls_other', {
                      count: calls.length,
                    })}
                  </Pill>
                ) : (
                  <Pill>
                    <ProfileIcon
                      label=""
                      width={16}
                      height={16}
                      color={theme.color.text.secondary}
                    />
                    {oneCall?.partnerName
                      ? t('external_random_calls.after.with_partner', {
                          name: oneCall.partnerName,
                        })
                      : t('external_random_calls.after.with_someone')}
                  </Pill>
                )}
                {!several && whenLabel ? (
                  <Pill>
                    <CalendarIcon
                      label=""
                      width={16}
                      height={16}
                      color={theme.color.text.secondary}
                    />
                    {whenLabel}
                  </Pill>
                ) : null}
                <Pill>
                  <ClockIcon
                    label=""
                    width={16}
                    height={16}
                    color={theme.color.text.secondary}
                  />
                  {durationLabel(
                    several ? totalMinutes : (oneCall?.durationMinutes ?? 0),
                  )}
                </Pill>
                {several && whenLabel ? (
                  <Pill>
                    <CalendarIcon
                      label=""
                      width={16}
                      height={16}
                      color={theme.color.text.secondary}
                    />
                    {whenLabel}
                  </Pill>
                ) : null}
              </Pills>
            ) : null}
            <OfferLayout $single={!several}>
              {several ? (
                <CallListCard>
                  <CardHeading>
                    {dateLabel
                      ? t('external_random_calls.offer.list_title', {
                          date: dateLabel,
                        })
                      : t('external_random_calls.offer.list_title_plain')}
                  </CardHeading>
                  {calls.map(call => {
                    const minutes = durationLabel(call.durationMinutes);
                    const meta = call.profileLine
                      ? t('external_random_calls.offer.profile_line', {
                          duration: minutes,
                          profile: call.profileLine,
                        })
                      : minutes;
                    const seed = call.partnerId || call.partnerName || call.id || '';
                    return (
                      <CallRow key={call.id}>
                        <Avatar $tone={avatarTone(seed)} aria-hidden="true">
                          {call.image ? (
                            <AvatarPhoto src={call.image} alt="" />
                          ) : (
                            initialFor(call.partnerName)
                          )}
                        </Avatar>
                        <CallCopy>
                          <CallName>
                            {call.partnerName ||
                              t('external_random_calls.offer.someone')}
                          </CallName>
                          <CallMeta>{meta}</CallMeta>
                        </CallCopy>
                      </CallRow>
                    );
                  })}
                </CallListCard>
              ) : null}
              <AccountCard>
                <CardHeading>
                  {t('external_random_calls.offer.account_title')}
                </CardHeading>
                {names.length > 0 ? (
                  <Benefit>
                    <TickCircle>
                      <TickIcon
                        label=""
                        width={14}
                        height={14}
                        color={TICK_COLOR}
                      />
                    </TickCircle>
                    <BenefitText>
                      {t(contactKey(names.length), {
                        name: names[0],
                        first: names[0],
                        second: names[1],
                        third: names[2],
                        count: Math.max(names.length - 2, 0),
                      })}
                    </BenefitText>
                  </Benefit>
                ) : null}
                <Benefit>
                  <TickCircle>
                    <TickIcon
                      label=""
                      width={14}
                      height={14}
                      color={TICK_COLOR}
                    />
                  </TickCircle>
                  <BenefitText>
                    {t('external_random_calls.offer.benefit_calls')}
                  </BenefitText>
                </Benefit>
                <Benefit>
                  <TickCircle>
                    <TickIcon
                      label=""
                      width={14}
                      height={14}
                      color={TICK_COLOR}
                    />
                  </TickCircle>
                  <BenefitText>
                    {t('external_random_calls.offer.benefit_email')}
                  </BenefitText>
                </Benefit>
                <Button
                  appearance={ButtonAppearance.Primary}
                  size={ButtonSizes.Stretch}
                  onClick={() => navigate(`/${SIGN_UP_ROUTE}`)}
                >
                  {t('external_random_calls.offer.create')}
                </Button>
                <LaterLink>
                  <Button
                    variation={ButtonVariations.Inline}
                    onClick={() => setLater(true)}
                    color={theme.color.text.link}
                  >
                    {t('external_random_calls.offer.later')}
                  </Button>
                </LaterLink>
                <Footnote>{t('external_random_calls.offer.footnote')}</Footnote>
              </AccountCard>
            </OfferLayout>
          </>
        )}
      </Column>
      <PageFooter />
    </Page>
  );
};

const GuestSessionEnded = () => {
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
        <GuestAccountOfferPage />
      </CustomThemeProvider>
    </I18nextProvider>
  );
};

export default GuestSessionEnded;
