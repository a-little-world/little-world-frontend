import { Link, TextTypes } from '@a-little-world/little-world-design-system';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';
import useSWR from 'swr';

import {
  USER_ENDPOINT,
  defaultPreFetchedOptions,
} from '../../features/swr/index';
import {
  PRIVACY_ROUTE,
  TERMS_ROUTE,
  WP_HOME_ROUTE,
  getAppRoute,
  getHomeRoute,
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

const Header = () => {
  const {
    i18n: { language },
    t,
  } = useTranslation();
  const { data: user } = useSWR(USER_ENDPOINT, defaultPreFetchedOptions);
  const userId = user?.id;

  return (
    <StyledHeader>
      <LogoLink href={userId ? getAppRoute() : WP_HOME_ROUTE}>
        <Logo stacked={false} />
      </LogoLink>
      <Options>
        <LanguageSelector />
      </Options>
      <Policies>
        <Link
          href={getHomeRoute(language, TERMS_ROUTE)}
          textType={TextTypes.Body6}
        >
          {t('header.terms')}
        </Link>
        <Link
          href={getHomeRoute(language, PRIVACY_ROUTE)}
          textType={TextTypes.Body6}
        >
          {t('header.privacy')}
        </Link>
      </Policies>
    </StyledHeader>
  );
};

export default Header;
