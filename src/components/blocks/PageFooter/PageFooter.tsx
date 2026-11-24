import { Link, TextTypes } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';

import {
  getHomeRoute,
  PRIVACY_ROUTE,
  WP_HOME_ROUTE,
} from '../../../router/routes';
import Logo from '../../atoms/Logo';
import {
  FooterBrand,
  FooterCopy,
  FooterLinks,
  FooterLogoLink,
  FooterRoot,
} from './PageFooter.styles';

const PageFooter = () => {
  const { t } = useTranslation();

  return (
    <FooterRoot>
      <FooterBrand>
        <FooterLogoLink href={WP_HOME_ROUTE} target="_blank" rel="noreferrer">
          <Logo stacked={false} asLink={false} />
        </FooterLogoLink>
        <FooterCopy>{t('partner_landing.footer.nonprofit')}</FooterCopy>
      </FooterBrand>
      <FooterLinks>
        <Link
          href={getHomeRoute('de', PRIVACY_ROUTE)}
          target="_blank"
          textType={TextTypes.Body6}
        >
          {t('header.privacy')}
        </Link>
        <Link
          href={getHomeRoute('de', 'impressum')}
          target="_blank"
          textType={TextTypes.Body6}
        >
          {t('partner_landing.footer.imprint')}
        </Link>
      </FooterLinks>
    </FooterRoot>
  );
};

export default PageFooter;
