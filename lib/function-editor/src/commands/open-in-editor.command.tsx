import { BsLayoutTextSidebarReverse } from "react-icons/bs"

import { FSID, PlainData } from "@ordo-pink/data"
import { DataProviders } from "@ordo-pink/frontend-create-function"

import DataIcon from "@ordo-pink/frontend-react-components/data-icon/data-icon.component"

const COMMAND_NAME = "editor.open"

type P = { commands: Client.Commands.Commands; data: DataProviders }
export const registerOpenInEditorCommand = ({ commands, data }: P) => {
	const unregisterCommand = registerCommand({ commands, data })
	const unregisterContextMenu = registerContextMenu({ commands, data })
	const unregisterCommandPalette = registerCommandPalette({ commands, data })

	return () => {
		unregisterCommand()
		unregisterContextMenu()
		unregisterCommandPalette()
	}
}

// --- Internal ---

const registerCommand = ({ commands }: P) => {
	const handle = (fsid: FSID) => {
		commands.emit<cmd.router.navigate>("router.navigate", `/editor/${fsid}`)
	}

	commands.on<cmd.editor.open>(COMMAND_NAME, handle)

	return () => {
		commands.off<cmd.editor.open>(COMMAND_NAME, handle)
	}
}

const registerContextMenu = ({ commands }: P) => {
	commands.emit<cmd.ctxMenu.add>("context-menu.add", {
		cmd: COMMAND_NAME,
		Icon: BsLayoutTextSidebarReverse,
		readableName: "Открыть в редакторе",
		type: "read",
		accelerator: "mod+e",
		shouldShow: ({ payload }) =>
			!!payload && payload !== "root" && !window.location.pathname.startsWith("/editor"),
		payloadCreator: ({ payload }) => (payload as PlainData).fsid,
	})

	return () => {
		commands.emit<cmd.ctxMenu.remove>("context-menu.remove", COMMAND_NAME)
	}
}

const registerCommandPalette = ({ commands, data }: P) => {
	commands.emit<cmd.commandPalette.add>("command-palette.add", {
		id: COMMAND_NAME,
		accelerator: "mod+meta+e",
		readableName: "Открыть в редакторе...",
		Icon: BsLayoutTextSidebarReverse,
		onSelect: () => {
			const files = data.getData()

			if (!files) return

			commands.emit<cmd.commandPalette.show>("command-palette.show", {
				items: files.map(
					file =>
						({
							Icon: () => <DataIcon plain={file} />,
							id: file.fsid,
							readableName: file.name,
							onSelect: () => {
								commands.emit<cmd.commandPalette.hide>("command-palette.hide")
								commands.emit<cmd.editor.open>("editor.open", file.fsid)
							},
						}) satisfies Client.CommandPalette.Item,
				),
			})
		},
	})

	return () => {
		commands.emit<cmd.commandPalette.remove>("command-palette.remove", COMMAND_NAME)
	}
}
