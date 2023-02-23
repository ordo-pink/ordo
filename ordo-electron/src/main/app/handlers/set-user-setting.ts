import type { UserSettings } from "@core/app/types"

import { nativeTheme } from "electron"

import { Theme } from "@core/theme"
import UserSettingsStore from "@main/app/user-settings-store"

export const handleSetUserSetting = <K extends keyof UserSettings>(
  payload: [K, UserSettings[K]]
) => {
  const [key, value] = payload

  if (!key) return

  UserSettingsStore.set(key, value)

  if (key === "appearance.theme") {
    nativeTheme.themeSource = value as Theme
  }
}
