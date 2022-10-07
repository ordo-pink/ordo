import type { Schema } from "electron-store"
import type { LocalSettings } from "@core/app/types"

/**
 * Local settings store JSON schema.
 */
export const LOCAL_SETTINGS_SCHEMA: Schema<LocalSettings> = {
  "side-bar.width": { type: "number", default: 0 },
  "window.height": { type: "number", default: 800 },
  "window.width": { type: "number", default: 600 },
  "window.position.x": { type: "number" },
  "window.position.y": { type: "number" },
  "file-explorer.expanded-folders": { type: "array", items: { type: "string" }, default: [] },
  "app.separator": { type: "string" },
}
