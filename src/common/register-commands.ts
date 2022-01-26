import { Command } from "../containers/commander/types"
import { State } from "../state"

export const registerCommands =
	(commands: Command[]) =>
	(state: State): void =>
		commands.forEach((command) => (state as any).state.application.commands.push(command))
