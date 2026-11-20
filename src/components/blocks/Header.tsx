import { ReactNode } from 'react';

import { Link, TextTypes } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { Link as RouterLink } from 'react-router-dom';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import { IS_AUTHENTICATED_ENDPOINT, USER_ENDPOINT } from '../../api/endpoints';
import { USER_TYPES } from '../../constants';
import {
  getAppRoute,
  getHomeRoute,
  PRIVACY_ROUTE,
  TERMS_ROUTE,
  WP_HOME_ROUTE,
} from '../../router/routes';
import Logo from '../atoms/Logo';
import LanguageSelector from './LanguageSelector/LanguageSelector';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  justify-content: space-between;
  border-bottom: 1px solid ${({ theme }) => theme.color.border.subtle};
  padding: ${({ theme }) => theme.spacing.small};
  background-color: ${({ theme }) => theme.color.surface.primary};
  height: 72px;
  z-index: 10;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  gap: ${({ theme }) => theme.spacing.xxxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.medium}) {
      height: 90px;
      padding: ${theme.spacing.large};
    }
  `}
`;

const Policies = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;

  gap: ${({ theme }) => theme.spacing.xxxsmall};
  justify-content: center;
  align-items: flex-end;
  text-align: right;
`;

const Options = styled.div`
  display: flex;
  align-items: center;
  padding-left: ${({ theme }) => theme.spacing.small};
  padding-right: ${({ theme }) => theme.spacing.small};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
      border-left: 1px solid ${theme.color.border.minimal};
      border-right: 1px solid ${theme.color.border.minimal};
    }
  `}
`;

const LogoLink = styled.a`
  display: flex;
  flex: 1;
  min-width: fit-content;
`;

const LogoRouterLink = styled(RouterLink)`
  display: flex;
  flex: 1;
  min-width: fit-content;
`;

const LogoMark = styled.div`
  display: flex;
  flex: 1;
  min-width: fit-content;
`;

const HeaderEnd = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: ${({ theme }) => theme.spacing.xsmall};
  min-width: 0;
`;

type HeaderProps = {
  /** Replaces language and policy links. Used when the page must not offer app navigation. */
  endSlot?: ReactNode;
  logoLinksOut?: boolean;
  /** In-app path for the logo. Takes precedence over the usual logo link. */
  logoTo?: string;
};

const Header = ({ endSlot, logoLinksOut = true, logoTo }: HeaderProps) => {
  const { t } = useTranslation();
  const { data: isAuthenticated } = useSWR(IS_AUTHENTICATED_ENDPOINT);
  const { data: user } = useSWR(isAuthenticated ? USER_ENDPOINT : null);
  const accessToMainApp =
    user?.profile?.user_type === USER_TYPES.learner
      ? user?.userFormCompleted
      : user?.isOnboarded;

  const logo = <Logo stacked={false} />;
  let logoLink = (
    <LogoLink href={WP_HOME_ROUTE} target="_blank">
      {logo}
    </LogoLink>
  );
  if (logoTo) {
    logoLink = <LogoRouterLink to={logoTo}>{logo}</LogoRouterLink>;
  } else if (!logoLinksOut) {
    logoLink = <LogoMark>{logo}</LogoMark>;
  } else if (accessToMainApp) {
    logoLink = <LogoRouterLink to={getAppRoute()}>{logo}</LogoRouterLink>;
  }

  return (
    <StyledHeader>
      {logoLink}
      {endSlot ? (
        <HeaderEnd>{endSlot}</HeaderEnd>
      ) : (
        <>
          <Options>
            <LanguageSelector />
          </Options>
          <Policies>
            <Link
              href={getHomeRoute('de', TERMS_ROUTE)}
              target="_blank"
              textType={TextTypes.Body6}
            >
              {t('header.terms')}
            </Link>
            <Link
              href={getHomeRoute('de', PRIVACY_ROUTE)}
              target="_blank"
              textType={TextTypes.Body6}
            >
              {t('header.privacy')}
            </Link>
          </Policies>
        </>
      )}
    </StyledHeader>
  );
};

export default Header;
