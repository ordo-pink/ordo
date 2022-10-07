import type { PayloadAction } from "@reduxjs/toolkit"

import { contextBridge, ipcRenderer } from "electron"

/**
 * @see https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
 */
contextBridge.exposeInMainWorld("ordo", {
  emit: (action: PayloadAction) => ipcRenderer.invoke(action.type, action.payload),
})
