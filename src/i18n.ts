import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './locales/en.json';
import ua from './locales/ua.json';
import cz from './locales/cz.json';

i18n.use(initReactI18next).init({
    resources: {
        EN: { translation: en },
        UA: { translation: ua },
        CZ: { translation: cz }
    },
    lng: localStorage.getItem('app_lang') || 'EN', // Начальный язык
    fallbackLng: 'EN',
    interpolation: { escapeValue: false }
});

export default i18n;