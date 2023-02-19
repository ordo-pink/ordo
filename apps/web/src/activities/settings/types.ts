import { ColourTheme } from "@ordo-pink/common-types"
import { ISO_639_1_Locale } from "@ordo-pink/locale"

export type SettingsPersistedState = {
  theme: ColourTheme
  language: ISO_639_1_Locale
}
