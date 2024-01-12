import { Link, TextTypes } from '@a-little-world/little-world-design-system';
import { useTranslation } from 'react-i18next';
import { useSelector } from 'react-redux';
import styled, { css } from 'styled-components';

import {
  PRIVACY_ROUTE,
  TERMS_ROUTE,
  WP_HOME_ROUTE,
  getAppRoute,
  getHomeRoute,
} from '../../routes';
import Logo from '../atoms/Logo';
import LanguageSelector from './LanguageSelector/LanguageSelector';

const StyledHeader = styled.header`
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  justify-content: space-between;
  border-bottom: 1px solid $grey;
  padding: ${({ theme }) => theme.spacing.small};
  background-color: white;
  height: 90px;
  z-index: 10;
  width: 100%;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.05);
  gap: ${({ theme }) => theme.spacing.xxxsmall};

  ${({ theme }) => css`
    @media (min-width: ${theme.breakpoints.small}) {
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
  const userId = useSelector(state => state.userData?.user?.id);

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
          to={getHomeRoute(language, TERMS_ROUTE)}
          textType={TextTypes.Body4}
        >
          {t('header.terms')}
        </Link>
        <Link
          to={getHomeRoute(language, PRIVACY_ROUTE)}
          textType={TextTypes.Body4}
        >
          {t('header.privacy')}
        </Link>
      </Policies>
    </StyledHeader>
  );
};

export default Header;
