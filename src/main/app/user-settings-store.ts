import type { UserSettings } from "@core/app/types"

import Store from "electron-store"

import { Theme } from "@core/theme"
import { Language } from "@core/locales"
import { USER_SETTINGS_SCHEMA } from "@client/settings/user-settings-schema"

/**
 * This store is used to store app level user preferences.
 */
export default new Store<UserSettings>({
  name: "user-settings",
  clearInvalidConfig: true,
  accessPropertiesByDotNotation: false,
  schema: USER_SETTINGS_SCHEMA,
  beforeEachMigration: (_, { fromVersion, toVersion, finalVersion }) => {
    console.log(
      `Applying migration from ${fromVersion} to ${toVersion}. Target version: ${finalVersion}`
    )
  },
  migrations: {
    "0.1.0": (store) => {
      store.set("appearance.language", Language.ENGLISH)
      store.set("appearance.theme", Theme.SYSTEM)
      store.set("project.personal.directory", "")
      store.set("files.confirm-delete", true)
      store.set("files.confirm-move", true)
      store.set("editor.font-size", 16)
    },
  },
})
