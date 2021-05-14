import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslations from './languages/en';
import ptTranslations from './languages/pt';

export const init = async () => {
  return i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources: {
        en: {
          translation: enTranslations,
        },
        pt: { translation: ptTranslations },
      },
      // lng: 'en',
      fallbackLng: 'en',
    });
};
