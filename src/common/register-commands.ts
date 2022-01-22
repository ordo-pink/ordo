import { produce } from "immer"
import { OrdoEvents, WindowState } from "./types"
import { Command } from "../containers/commander/types"
import { ipcMain } from "electron"

export const registerCommands =
	<T extends OrdoEvents = OrdoEvents>(commands: Command<T>[]) =>
	(state: WindowState): WindowState =>
		produce(
			state,
			(draft) => commands.forEach((command) => draft.application.commands.push(command)),
			(patches) => {
				ipcMain.emit("apply-main-state-patches", patches)
			},
		)
