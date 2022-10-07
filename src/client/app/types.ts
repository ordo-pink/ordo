import type { UserSettings } from "@core/app/types"

import { USER_SETTINGS_SCHEMA } from "@core/app/user-settings-schema"

export type SettingsItemProps<Key extends keyof UserSettings = keyof UserSettings> = {
  schema: typeof USER_SETTINGS_SCHEMA[Key]
  schemaKey: Key
  value: UserSettings[Key]
}
