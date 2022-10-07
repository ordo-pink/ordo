import type { LocalSettings } from "@core/app/types"

import Store from "electron-store"
import { sep } from "path"

import { LOCAL_SETTINGS_SCHEMA } from "@core/app/local-settings-schema"

/**
 * This store is used to store internal settings for the current device the
 * app is running on.
 */
export default new Store<LocalSettings>({
  name: "local-settings",
  accessPropertiesByDotNotation: false,
  clearInvalidConfig: true,
  schema: LOCAL_SETTINGS_SCHEMA,
  migrations: {
    "0.1.0": (store) => {
      store.set("app.side-bar.width", 800)
      store.set("app.window.height", 600)
      store.set("app.file-explorer.expanded-folders", [])
      store.set("app.side-bar.width", 0)
      store.set("app.separator", sep)
    },
  },
})
