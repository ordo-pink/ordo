import { produce } from "immer"
import { OrdoEvents, WindowState } from "./types"
import { Command } from "../containers/commander/types"

export const registerCommands =
	<T extends OrdoEvents = OrdoEvents>(commands: Command<T>[]) =>
	(state: WindowState): WindowState =>
		produce(state, (draft) => commands.forEach((command) => void draft.application.commands.push(command)))
