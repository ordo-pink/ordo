import type { LocalSettings } from "@core/app/types"

import LocalSettingsStore from "@main/app/local-settings-store"

export const handleSetLocalSetting = <K extends keyof LocalSettings>(
  payload: [K, LocalSettings[K]]
) => {
  const [key, value] = payload

  if (!key) return

  LocalSettingsStore.set(key, value)
}
