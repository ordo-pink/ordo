import { ipcMain } from "electron"
import { WindowState } from "../../../common/types"
import { Command } from "../../../containers/commander/types"

const separator = { type: "separator" }

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
]

const getCommandByName = (name: string, state: WindowState): Command =>
	state.application.commands.find((c) => c.name === name) as Command

export const applicationMenuTemlate = (state: WindowState): any[] =>
	(process.platform === "darwin" ? MAC_MENU : []).concat([
		{
			label: "&File",
			submenu: [
				toMenuItem(getCommandByName("Open Folder", state)),
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
				toMenuItem(getCommandByName("Close Window", state)),
			],
		},
		{
			label: "&View",
			submenu: [
				toMenuItem(getCommandByName("Restart Window", state)),
				toMenuItem(getCommandByName("Refresh State", state)),
				toMenuItem(getCommandByName("Toggle Dev Tools", state)),
				toMenuItem(getCommandByName("Reload Window", state)),
				separator,
				toMenuItem(getCommandByName("Toggle Sidebar", state)),
				toMenuItem(getCommandByName("Toggle Activity Bar", state)),
				toMenuItem(getCommandByName("Toggle Commander", state)),
				separator,
				toMenuItem(getCommandByName("Open Editor", state)),
				toMenuItem(getCommandByName("Open Graph", state)),
				toMenuItem(getCommandByName("Open Find in Files", state)),
				separator,
				toMenuItem(getCommandByName("Open Settings", state)),
			],
		},
	] as any)

export const toMenuItem = (command?: Command): any => {
	if (!command) {
		return separator
	}

	return {
		label: command.name,
		accelerator: command.shortcut,
		click: () => ipcMain.emit(command.event[0]),
	}
}
