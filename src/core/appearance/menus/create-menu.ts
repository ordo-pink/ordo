import { MenuItem } from "electron";
import { EventTransmission } from "../../../event-transmission";

export const createMenuTemplate =
	(commands: Array<keyof OrdoEvent | Partial<MenuItem> | { type: string }>) =>
	(transmission: EventTransmission): MenuItem[] => {
		const menu = commands.map((event) => {
			if (typeof event !== "string") {
				return event;
			}

			const registerredCommands = transmission.get((state) => state.application.commands);

			const command = registerredCommands.find((registerredCommand) => registerredCommand.event === event);

			if (!command) {
				console.log(`Command "${event}" not found. Maybe it was not registerred with "registerCommands".`);

				return { type: "separator" };
			}

			return {
				label: command.name,
				commandId: command.event,
				accelerator: command.shortcut,
				click: () => transmission.emit(command.event as keyof OrdoEvent),
			};
		});

		return menu as unknown as MenuItem[];
	};
