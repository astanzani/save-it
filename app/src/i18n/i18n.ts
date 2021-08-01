import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enSignUp from 'pages/signup/i18n/en';
import enSignIn from 'pages/signin/i18n/en';
import enForgotPassword from 'pages/forgotpassword/i18n/en';
import enResetPassword from 'pages/resetpassword/i18n/en';
import enHome from 'pages/home/i18n/en';

import ptSignIn from 'pages/signin/i18n/pt';
import ptSignUp from 'pages/signup/i18n/pt';
import ptForgotPassword from 'pages/forgotpassword/i18n/pt';
import ptResetPassword from 'pages/resetpassword/i18n/pt';
import ptHome from 'pages/home/i18n/pt';

export const init = async () => {
  return i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .init({
      resources: {
        en: {
          signup: { ...enSignUp },
          signin: { ...enSignIn },
          forgotpassword: { ...enForgotPassword },
          resetpassword: { ...enResetPassword },
          home: { ...enHome },
        },
        pt: {
          signin: { ...ptSignIn },
          signup: { ...ptSignUp },
          forgotpassword: { ...ptForgotPassword },
          resetpassword: { ...ptResetPassword },
          home: { ...ptHome },
        },
      },
      fallbackLng: 'en',
    });
};
