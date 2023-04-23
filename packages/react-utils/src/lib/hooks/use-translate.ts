import i18next from "i18next"
import { useTranslation } from "react-i18next"

export const useTranslate = (ns: string) => {
  return useTranslation(ns)
}

export const wieldTranslate = (ns: string) => ({
  t: (key: string) => i18next.t(key, { ns }),
  i18n: i18next,
  ready: i18next.isInitialized,
})
