import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'fr',
        supportedLngs: ['fr', 'en', 'es', 'pt'],
        debug: process.env.NODE_ENV === 'development',
        interpolation: {
            escapeValue: false
        },
        backend: {
            loadPath: '/locales/{{lng}}/{{ns}}.json'
        },
        detection: {
            order: ['querystring', 'cookie', 'localStorage', 'navigator'],
            caches: ['cookie', 'localStorage']
        }
    });

export default i18n;
