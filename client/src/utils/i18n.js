import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import fr from '../assets/i18n/fr.json';
import en from '../assets/i18n/en.json';

i18n.use(initReactI18next).init({
  lng: 'fr',
  fallbackLng: 'fr',
  supportedLngs: ['fr', 'en'],
  resources: {
    fr: {
      translation: fr,
    },
    en: {
      translation: en,
    },
  },
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
