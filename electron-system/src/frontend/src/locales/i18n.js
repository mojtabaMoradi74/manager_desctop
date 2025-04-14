import i18n from 'i18next'
import {initReactI18next} from 'react-i18next'
import LanguageDetector from 'i18next-browser-languagedetector'
//
import enLocales from './en.json'
import deLocales from './de.json'
import faLocales from './fa.json'
import frLocales from './fr.json'

// ----------------------------------------------------------------------

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {translations: enLocales},
      de: {translations: deLocales},
      fr: {translations: frLocales},
      fa: {translations: faLocales},
    },
    lng: 'fa',
    fallbackLng: 'fa',
    debug: false,
    ns: ['translations'],
    defaultNS: 'translations',
    interpolation: {
      escapeValue: false,
    },
  })
// localStorage.getItem('i18nextLng') ||
export default i18n
