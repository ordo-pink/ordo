import { ColourTheme } from "@ordo-pink/common-types"
import { TwoLetterLocale } from "@ordo-pink/locale"
import en from "./translations/en.json"
import ru from "./translations/ru.json"
import { SettingsPersistedState } from "./types"
import { createActivityExtension } from "../../core/extensions/create-activity-extension"
import { OrdoExtensionProps } from "../../core/types"

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

export type SettingsProps = OrdoExtensionProps<typeof settings>

export default settings
