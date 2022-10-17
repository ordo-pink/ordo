import { FC } from "react"

import Switch from "@core/utils/switch"

import { USER_SETTINGS_SCHEMA } from "@core/app/user-settings-schema"

import CheckboxSetting from "@client/app/components/settings/checkbox-setting"
import SelectSetting from "@client/app/components/settings/select-setting"
import StringSetting from "@client/app/components/settings/string-setting"
import NumberSetting from "@client/app/components/settings/number-setting"
import SelectDirectorySetting from "@client/app/components/settings/select-directory-setting"
import Null from "@client/null"
import { UserSettings } from "@core/app/types"
import type { Schema } from "electron-store"

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
