import i18next from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Cookies from 'js-cookie';
import { initReactI18next } from 'react-i18next';

import { LANGUAGES } from './constants';
import translationDE from './locale/de.json';
import translationEN from './locale/en.json';
import translationBackendDE from './locale/backend/de.json';
import translationBackendEN from './locale/backend/en.json';

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    /*
    I'm overwriting the seperators here since the backend also uses '.' in the translations!
    */
    nsSeparator: ':::',
    keySeparator: '::',
    resources: {
      en: {
        translation: {
          ...translationEN,
          ...translationBackendEN,
        },
      },
      de: {
        translation: {
          ...translationDE,
          ...translationBackendDE,
        },
      },
    },
    languages: [LANGUAGES.en, LANGUAGES.de],
    fallbackLng: LANGUAGES.de,
  });

export const COOKIE_LANG = 'frontendLang';
const cookie = Cookies.get(COOKIE_LANG);
if (cookie !== undefined) {
  i18next.changeLanguage(cookie);
}