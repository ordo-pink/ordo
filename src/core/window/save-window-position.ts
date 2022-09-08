import { BrowserWindow } from "electron";

import { internalSettingsStore } from "@core/settings/internal-settings";

export const saveWindowPosition = (window: BrowserWindow) => {
  const [width, height] = window.getSize();
  const [x, y] = window.getPosition();
  const position = { x, y };

  internalSettingsStore.set("window", { width, height, position });
};
