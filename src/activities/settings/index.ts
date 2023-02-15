import { ColourTheme, Language } from "@ordo-pink/core"
import { SettingsPersistedState } from "./types"
import en from "$activities/settings/translations/en.json"
import ru from "$activities/settings/translations/ru.json"
import { createActivityExtension } from "$core/extensions/create-activity-extension"
import { OrdoExtensionProps } from "$core/types"

const settings = createActivityExtension("settings", {
  Component: () => import("$activities/settings/components"),
  Icon: () => import("$activities/settings/components/icon"),
  routes: ["/settings", "/settings/:extension"],
  readableName: "@ordo-activity-settings/title",
  translations: { en, ru },
  persistedState: {
    language: Language.ENGLISH,
    theme: ColourTheme.SYSTEM,
  } as SettingsPersistedState,
})

export type SettingsProps = OrdoExtensionProps<typeof settings>

export default settings
