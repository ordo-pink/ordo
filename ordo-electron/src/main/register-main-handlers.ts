import type { IpcMain } from "electron"
import type { Fn } from "@core/types"

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const registerMainHandlers = (handlers: Record<string, Fn<any>>) => (ipcMain: IpcMain) => {
  const keys = Object.keys(handlers)

  keys.forEach((key) => ipcMain.handle(key, (_, payload) => handlers[key](payload)))

  return () => keys.forEach((key) => ipcMain.removeHandler(key))
}
