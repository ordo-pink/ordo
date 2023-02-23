import i18next, { use } from "i18next"
import { initReactI18next } from "react-i18next"

import ruEditor from "@client/editor/translations/ru.json"
import enEditor from "@client/editor/translations/en.json"

import ruApp from "@client/app/translations/ru.json"
import enApp from "@client/app/translations/en.json"

use(initReactI18next).init({
  resources: {
    en: { translation: { ...enApp, ...enEditor } },
    ru: { translation: { ...ruApp, ...ruEditor } },
  },
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18next
