import i18next from "i18next";
import Cookies from "js-cookie";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import translation from "./translation.json";


i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: translation.en,
      },
      de: {
        translation: translation.de,
      },
    },
    fallbackLng: "en",
  });

const cookieName = "frontendLang";
const cookie = Cookies.get(cookieName);
if (cookie !== undefined) {
  i18next.changeLanguage(cookie);
}
