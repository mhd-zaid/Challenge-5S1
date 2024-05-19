import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    debug: true,
    fallbackLng: 'fr',
    supportedLngs: ['fr', 'en'],
    ns: ['trad'],
    backend: {
      loadPath:
        import.meta.env.VITE_BACKEND_URL + '/translations/{{lng}}/{{ns}}',
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
