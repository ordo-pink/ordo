import i18next from "i18next"
import { initReactI18next } from "react-i18next"

i18next.use(initReactI18next).init({
  resources: {
    ru: {},
    en: {},
  },
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
})

export const useI18nInit = () => i18next
