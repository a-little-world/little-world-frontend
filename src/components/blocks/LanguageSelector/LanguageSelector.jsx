import {
  Button,
  ButtonVariations,
} from '@a-little-world/little-world-design-system';
import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';
import styled, { css } from 'styled-components';

import { LANGUAGES } from '../../../constants';
import { COOKIE_LANG } from '../../../i18n';

const Selector = styled.div`
  display: flex;
  align-items: center;
`;

const LanguageButton = styled(Button)`
  font-weight: bold;
  border: none;
  font-size: 0.875rem;
  line-height: 1rem;
  background: ${({ theme }) => theme.color.surface.disabled};
  color: ${({ theme }) => theme.color.border.moderate};
  cursor: pointer;
  text-transform: uppercase;
  padding: ${({ theme }) => theme.spacing.xxsmall};

  ${({ disabled }) =>
    disabled
    && css`
      background: ${({ theme }) => theme.color.surface.primary} !important;
      color: ${({ theme }) => theme.color.text.highlight} !important;
    `}
`;

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const handleChangeLanguage = lang => {
    i18n.changeLanguage(lang);
    Cookies.set(COOKIE_LANG, lang);
  };

  return (
    <Selector>
      <LanguageButton
        aria-label="switch language to German"
        variation={ButtonVariations.Inline}
        onClick={() => handleChangeLanguage(LANGUAGES.de)}
        disabled={i18n.language === LANGUAGES.de}
        $right
      >
        DE
      </LanguageButton>
      <LanguageButton
        aria-label="switch language to English"
        variation={ButtonVariations.Inline}
        onClick={() => handleChangeLanguage(LANGUAGES.en)}
        disabled={i18n.language.includes(LANGUAGES.en)} // multiple en codes e.g. en-GB
      >
        EN
      </LanguageButton>
    </Selector>
  );
};

export default LanguageSelector;
