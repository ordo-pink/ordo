import { BsFolder2Open } from "react-icons/bs"

import { type DataProviders } from "@ordo-pink/create-function"
import { type FSID } from "@ordo-pink/data"
import { Switch } from "@ordo-pink/switch"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerShowInFileExplorerCommand = (params: P) => {
	const unregisterCommand = registerCommand(params)
	const unregisterContextMenu = registerContextMenu(params)
	// TODO: registerCommandPalette

	return () => {
		unregisterCommand()
		unregisterContextMenu()
	}
}

// --- Internal ---

const registerCommand = (params: P) => {
	params.commands.on<cmd.fileExplorer.showInFileExplorer>(
		"file-explorer.show-in-file-explorer",
		commandHandler(params),
	)

	return () => {
		params.commands.off<cmd.fileExplorer.showInFileExplorer>(
			"file-explorer.show-in-file-explorer",
			commandHandler(params),
		)
	}
}

const registerContextMenu = ({ commands }: P) => {
	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: "file-explorer.show-in-file-explorer",
		Icon: BsFolder2Open,
		readableName: "Открыть в менеджере файлов",
		type: "read",
		accelerator: "mod+shift+e",
		shouldShow: ({ payload }) => !!payload && !window.location.pathname.startsWith("/fs"),
	})

	return () => {
		commands.emit<cmd.ctxMenu.remove>("context-menu.remove", "file-explorer.show-in-file-explorer")
	}
}

const commandHandler =
	({ data, commands }: P) =>
	(fsid: FSID) => {
		const children = data.getChildren(fsid)
		const item = data.findItemByFSID(fsid)

		const route = Switch.empty()
			.case(children.length > 0, () => `/fs/${fsid}`)
			.case(!!item && !item.parent, () => `/fs/${item!.parent}?selected=${fsid}`)
			.case(!!item && !!item.parent, () => `/fs?selected=${fsid}`)
			.default(() => void 0)

		commands.emit<cmd.router.navigate>("router.navigate", route)
	}
