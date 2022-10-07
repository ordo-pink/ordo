import type { Schema } from "electron-store"
import type { UserSettings } from "@core/app/types"

import { Theme } from "@core/theme"
import { Language } from "@core/locales"

/**
 * User settings store JSON schema.
 */
export const USER_SETTINGS_SCHEMA: Schema<UserSettings> = {
  "appearance.theme": {
    type: "string",
    enum: [Theme.SYSTEM, Theme.LIGHT, Theme.DARK],
    default: Theme.SYSTEM,
  },
  "appearance.language": {
    type: "string",
    enum: [Language.ENGLISH, Language.RUSSIAN],
    default: Language.ENGLISH,
  },
  "editor.font-size": { type: "number", default: 16, minimum: 8, maximum: 20 },
  "project.personal.directory": { type: "string", default: "" },
  "files.confirm-move": { type: "boolean", default: true },
  "files.confirm-delete": { type: "boolean", default: true },
}
