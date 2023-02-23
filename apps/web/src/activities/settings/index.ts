import { ColourTheme } from "@ordo-pink/common-types"
import { createActivityExtension, OrdoActivityProps } from "@ordo-pink/extensions"
import { TwoLetterLocale } from "@ordo-pink/locale"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { SettingsPersistedState } from "./types"

const settings = createActivityExtension("settings", {
  Component: () => import("./components"),
  Icon: () => import("./components/icon"),
  routes: ["/settings", "/settings/:extension"],
  readableName: "@ordo-activity-settings/title",
  translations: { en, ru },
  persistedState: {
    language: TwoLetterLocale.ENGLISH,
    theme: ColourTheme.SYSTEM,
  } as SettingsPersistedState,
})

export type SettingsProps = OrdoActivityProps<typeof settings>

export default settings
