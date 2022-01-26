import { Command } from "../containers/commander/types";
import { State } from "../state";
import { WindowState } from "./types";

export const registerCommands =
	(commands: Command[]) =>
	(state: State): void =>
		commands.forEach((command) => (state as unknown as { state: WindowState }).state.application.commands.push(command));
