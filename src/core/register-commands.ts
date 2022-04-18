import { Command } from "@containers/commander/types";
import { EventTransmission } from "../event-transmission";
import { WindowState } from "@core/types";

export const registerCommands =
	(commands: Command[]) =>
	(transmission: EventTransmission): void =>
		commands.forEach((command) =>
			(transmission as unknown as { state: WindowState }).state.application.commands.push(command),
		);
