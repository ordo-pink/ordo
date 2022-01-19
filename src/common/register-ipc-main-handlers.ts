import { IpcMain } from "electron"
import { produce, Draft } from "immer"
import { OrdoEvents, WindowContext, WindowState } from "../common/types"

export type IpcMainHandlerInterface = {
	register: (state: WindowState, context: WindowContext) => void
	unregister: () => void
}

export type EventHandler<T extends OrdoEvents> = (state: Draft<WindowState>, arg: T[1]) => void | Promise<void>

export const registerIpcMainHandlers =
	<T extends OrdoEvents>(handlers: Record<T[0], EventHandler<T>>) =>
	(ipcMain: IpcMain): IpcMainHandlerInterface => ({
		register: (state: WindowState, context: WindowContext) =>
			Object.keys(handlers).forEach((event) => {
				ipcMain.handle(event, async (_, arg) => {
					state = await produce(
						state,
						async (draft) => (handlers as unknown as Record<string, any>)[event](draft, arg),
						(patches) => {
							context.window.webContents.send("apply-state-patches", patches)
						},
					)
				})
			}),
		unregister: () => Object.keys(handlers).forEach((event) => ipcMain.removeHandler(event)),
	})
