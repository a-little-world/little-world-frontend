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
import { useNavigate } from 'react-router-dom';
import { mutate } from 'swr';

import { USER_ENDPOINT } from '../../../api/endpoints';
import { openPartnerAccess } from '../../../api/partnerLanding';
import { LANGUAGES } from '../../../constants/index';
import AdventStatusPage from './AdventStatusPage';
import { StatusWrap } from './PartnerLanding.styles';

type AccessError = 'missing' | 'invalid' | 'session_ended' | 'already_active';

const tokenFromHash = () =>
  new URLSearchParams(window.location.hash.replace(/^#/, '')).get('token');

/** The access mail's magic link: signs the person in, then opens the session's partner page. */
const PartnerAccessPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [error, setError] = useState<AccessError | null>(null);

  useEffect(() => {
    const token = tokenFromHash();
    if (!token) {
      setError('missing');
      return undefined;
    }
    let cancelled = false;
    openPartnerAccess(token)
      .then(async response => {
        if (cancelled) return;
        // The session changed: drop any cached signed-out answer before the page loads.
        await mutate(USER_ENDPOINT);
        navigate(response.personal_path, { replace: true });
      })
      .catch((accessError: { data?: { code?: string } }) => {
        if (cancelled) return;
        const code = accessError?.data?.code;
        setError(
          code === 'session_ended' || code === 'already_active'
            ? code
            : 'invalid',
        );
      });
    return () => {
      cancelled = true;
    };
  }, [navigate]);

  if (error) {
    return (
      <AdventStatusPage>
        <Text type={TextTypes.Heading5} tag="h1">
          {t(`partner_landing.access.${error}`)}
        </Text>
      </AdventStatusPage>
    );
  }

  return (
    <StatusWrap>
      <Loading size={LoadingSizes.Medium} />
    </StatusWrap>
  );
};

const PartnerAccess = () => {
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
        <PartnerAccessPage />
      </CustomThemeProvider>
    </I18nextProvider>
  );
};

export default PartnerAccess;
