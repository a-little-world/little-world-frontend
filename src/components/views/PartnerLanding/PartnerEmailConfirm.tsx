import { useEffect, useMemo, useState } from 'react';

import {
  CustomThemeProvider,
  Loading,
  LoadingSizes,
  Text,
  TextTypes,
  ThemeVariants,
} from '@a-little-world/little-world-design-system';
import { I18nextProvider, useTranslation } from 'react-i18next';

import {
  PartnerVerifyResult,
  verifyPartnerEmail,
} from '../../../api/partnerLanding';
import { LANGUAGES } from '../../../constants/index';
import { WP_HOME_ROUTE } from '../../../router/routes';
import Garland from '../../blocks/Garland/Garland';
import AdventStatusPage from './AdventStatusPage';
import { eventFromLanding } from './constants';
import PartnerConfirmation, {
  PartnerConfirmationIntro,
} from './PartnerConfirmation';
import {
  ConfirmHero,
  HomeLink,
  NavBar,
  Page,
  StatusWrap,
  WhiteLogo,
} from './PartnerLanding.styles';

const tokenFromHash = () =>
  new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token');

const PartnerEmailConfirmPage = () => {
  const { t } = useTranslation();
  const [result, setResult] = useState<PartnerVerifyResult | null>(null);
  const [error, setError] = useState<
    'missing' | 'invalid' | 'session_ended' | 'already_registered' | null
  >(null);

  useEffect(() => {
    const token = tokenFromHash();
    if (!token) {
      setError('missing');
      return undefined;
    }
    let cancelled = false;
    verifyPartnerEmail(token)
      .then(response => {
        if (cancelled) return;
        window.history.replaceState(null, '', window.location.pathname);
        setResult(response);
      })
      .catch((submitError: { data?: { code?: string } }) => {
        if (cancelled) return;
        const code = submitError?.data?.code;
        if (code === 'session_ended' || code === 'already_registered') {
          setError(code);
        } else {
          setError('invalid');
        }
      });
    return () => {
      cancelled = true;
    };
  }, [t]);

  if (error) {
    return (
      <AdventStatusPage>
        <Text type={TextTypes.Heading5} tag="h1">
          {t(`partner_landing.verify.${error}`)}
        </Text>
      </AdventStatusPage>
    );
  }

  if (!result) {
    return (
      <StatusWrap>
        <Loading size={LoadingSizes.Medium} />
      </StatusWrap>
    );
  }

  const event = eventFromLanding(result);

  return (
    <Page>
      <ConfirmHero>
        <Garland />
        <NavBar>
          <HomeLink href={WP_HOME_ROUTE} target="_blank" rel="noreferrer">
            <WhiteLogo stacked={false} asLink={false} />
          </HomeLink>
        </NavBar>
        <PartnerConfirmationIntro event={event} />
      </ConfirmHero>
      <PartnerConfirmation event={event} accessUrl={result.access_url} />
    </Page>
  );
};

const PartnerEmailConfirm = () => {
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
        <PartnerEmailConfirmPage />
      </CustomThemeProvider>
    </I18nextProvider>
  );
};

export default PartnerEmailConfirm;
