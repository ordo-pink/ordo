import type { FC } from "react"
import type { Schema } from "electron-store"
import type { UserSettings } from "@core/app/types"

import Switch from "@client/common/utils/switch"

import { USER_SETTINGS_SCHEMA } from "@client/settings/user-settings-schema"

import CheckboxSetting from "@client/settings/components/checkbox-setting"
import SelectSetting from "@client/settings/components/select-setting"
import StringSetting from "@client/settings/components/string-setting"
import NumberSetting from "@client/settings/components/number-setting"
import SelectDirectorySetting from "@client/settings/components/select-directory-setting"
import Null from "@client/common/null"

export const useSettingInput = <Key extends keyof typeof USER_SETTINGS_SCHEMA>(
  key: Key,
  property: typeof USER_SETTINGS_SCHEMA[Key]
) =>
  Switch.of(property)
    .case((prop) => Boolean(prop.enum), SelectSetting)
    .case(() => key === "project.personal.directory", SelectDirectorySetting)
    .case((prop) => prop.type === "boolean", CheckboxSetting)
    .case((prop) => prop.type === "string", StringSetting)
    .case((prop) => prop.type === "number", NumberSetting)
    .default(Null) as FC<{
    value: string | number | boolean
    schema: Schema<unknown>
    schemaKey: keyof UserSettings
  }>
