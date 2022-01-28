import { EventTransmission } from "../../../event-transmission";
import { Command } from "../../../containers/commander/types";

const separator = { type: "separator" };

const MAC_MENU = [
	{
		label: "Ordo",
		submenu: [
			{ role: "about" },
			separator,
			{ role: "services" },
			separator,
			{ role: "hide" },
			{ role: "hideOthers" },
			{ role: "unhide" },
			separator,
			{ role: "quit" },
		],
	},
];

const getCommandByName = (name: string, state: EventTransmission): Command =>
	state.get((s) => s.application.commands).find((c) => c.name === name) as Command;

export const applicationMenuTemlate = (state: EventTransmission): any[] =>
	(process.platform === "darwin" ? MAC_MENU : []).concat([
		{
			label: "&File",
			submenu: [
				toMenuItem(getCommandByName("Open Folder", state), state),
				{
					label: "Open Recent",
					role: "recentDocuments",
					submenu: [
						{
							label: "Clear Recent",
							role: "clearRecentDocuments",
						},
					],
				},
				separator,
				toMenuItem(getCommandByName("Save File", state), state),
				separator,
				toMenuItem(getCommandByName("Close File", state), state),
				toMenuItem(getCommandByName("Close Window", state), state),
			],
		},
		{
			label: "&View",
			submenu: [
				toMenuItem(getCommandByName("Restart Window", state), state),
				toMenuItem(getCommandByName("Refresh State", state), state),
				toMenuItem(getCommandByName("Toggle Dev Tools", state), state),
				toMenuItem(getCommandByName("Reload Window", state), state),
				separator,
				toMenuItem(getCommandByName("Toggle Sidebar", state), state),
				toMenuItem(getCommandByName("Toggle Activity Bar", state), state),
				toMenuItem(getCommandByName("Toggle Commander", state), state),
				separator,
				toMenuItem(getCommandByName("Open Editor", state), state),
				toMenuItem(getCommandByName("Open Graph", state), state),
				toMenuItem(getCommandByName("Open Find in Files", state), state),
				separator,
				toMenuItem(getCommandByName("Open Settings", state), state),
			],
		},
		{
			label: "&Selection",
			submenu: [toMenuItem(getCommandByName("Select All", state), state)],
		},
	] as any);

export const toMenuItem = (command: Command, state: EventTransmission): any => {
	if (!command) {
		return separator;
	}

	return {
		label: command.name,
		accelerator: command.shortcut,
		click: () => state.emit(command.event),
	};
};
