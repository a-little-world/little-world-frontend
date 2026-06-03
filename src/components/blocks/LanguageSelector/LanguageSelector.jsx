import Cookies from 'js-cookie';
import React from 'react';
import { useTranslation } from 'react-i18next';

import OptionSelector from '../../atoms/OptionSelector';
import { LANGUAGES } from '../../../constants/index';
import { COOKIE_LANG } from '../../../i18n';

const LANGUAGE_OPTIONS = [
  { value: LANGUAGES.de, label: 'DE', ariaLabel: 'switch language to German' },
  { value: LANGUAGES.en, label: 'EN', ariaLabel: 'switch language to English' },
];

const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const currentValue =
    i18n.language === LANGUAGES.de || i18n.language?.startsWith?.(LANGUAGES.de) ?
      LANGUAGES.de :
      LANGUAGES.en;

  const handleChangeLanguage = lang => {
    i18n.changeLanguage(lang);
    Cookies.set(COOKIE_LANG, lang);
  };

  return (
    <OptionSelector
      options={LANGUAGE_OPTIONS}
      value={currentValue}
      onChange={handleChangeLanguage}
    />
  );
};

export default LanguageSelector;
