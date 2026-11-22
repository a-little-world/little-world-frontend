import React from 'react';

import Cookies from 'js-cookie';
import { useTranslation } from 'react-i18next';

import { LANGUAGES } from '../../../constants/index';
import { COOKIE_LANG } from '../../../i18n';
import OptionSelector from '../../atoms/OptionSelector';

// Each language is named in itself (and marked with `lang`) so people who
// can't read the current UI language can still find their own.
const LANGUAGE_OPTIONS = [
  { value: LANGUAGES.de, label: 'DE', ariaLabel: 'Deutsch', lang: 'de' },
  { value: LANGUAGES.en, label: 'EN', ariaLabel: 'English', lang: 'en' },
];

const LanguageSelector = () => {
  const { t, i18n } = useTranslation();

  const currentValue =
    i18n.language === LANGUAGES.de || i18n.language?.startsWith?.(LANGUAGES.de)
      ? LANGUAGES.de
      : LANGUAGES.en;

  const handleChangeLanguage = lang => {
    i18n.changeLanguage(lang);
    Cookies.set(COOKIE_LANG, lang);
  };

  return (
    <OptionSelector
      options={LANGUAGE_OPTIONS}
      value={currentValue}
      onChange={handleChangeLanguage}
      groupLabel={t('a11y.language')}
    />
  );
};

export default LanguageSelector;
