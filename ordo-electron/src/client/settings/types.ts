import type { UserSettings } from "@core/app/types"

// TODO: Reorganise settings so that it does not matter where exactly they are stored
// E.g. `projectDirectory` should go to localSettings
import { USER_SETTINGS_SCHEMA } from "@client/settings/user-settings-schema"

export type SettingsItemProps<Key extends keyof UserSettings = keyof UserSettings> = {
  schema: typeof USER_SETTINGS_SCHEMA[Key]
  schemaKey: Key
  value: UserSettings[Key]
}
