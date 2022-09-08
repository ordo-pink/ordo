import { BrowserWindow } from "electron";

import { OrdoEventHandler } from "@core/types";

/**
 * Triggers closing currently focused window (if there is any).
 */
export const handleCloseWindow: OrdoEventHandler<"@app/close-window"> = () => {
  BrowserWindow.getFocusedWindow()?.close();
};
