import i18next, { use } from "i18next"
import { initReactI18next } from "react-i18next"

// TODO: 70
// TODO: 71
import ruEditor from "@core/editor/translations/ru.json"
import enEditor from "@core/editor/translations/en.json"

import ruCheckboxes from "@client/checkboxes/translations/ru.json"
import enCheckboxes from "@client/checkboxes/translations/en.json"

import ruTags from "@client/tags/translations/ru.json"
import enTags from "@client/tags/translations/en.json"

import ruApp from "@core/app/translations/ru.json"
import enApp from "@core/app/translations/en.json"

use(initReactI18next).init({
  resources: {
    en: { translation: { ...enApp, ...enEditor, ...enCheckboxes, ...enTags } },
    ru: { translation: { ...ruApp, ...ruEditor, ...ruCheckboxes, ...ruTags } },
  },
  fallbackLng: "en",
  interpolation: { escapeValue: false },
})

export default i18next
