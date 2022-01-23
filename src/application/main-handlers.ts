import { ipcMain } from "electron"
import { registerIpcMainHandlers } from "../common/register-ipc-main-handlers"
import { listFolder } from "./fs/list-folder"
import { readFile } from "./fs/read-file"
import { ApplicationEvent, OpenOrdoFile, KeysDown } from "./types"
import { getFile } from "./utils/get-file"
import { promises } from "fs"

import { WindowState } from "../common/types"
import { Switch } from "or-else"
import { handleEnter } from "./key-handlers/enter"
import { handleTab } from "./key-handlers/tab"
import { handleTyping } from "./key-handlers/letters"
import { handleArrowUp } from "./key-handlers/arrow-up"
import { handleArrowLeft } from "./key-handlers/arrow-left"
import { handleArrowRight } from "./key-handlers/arrow-right"
import { handleArrowDown } from "./key-handlers/arrow-down"
import { handleBackspace } from "./key-handlers/backspace"
import { saveFile } from "./fs/save-file"

const createAccelerator = (keys: KeysDown): string => {
	let combo = ""

	if (keys.ctrlKey || keys.metaKey) {
		combo += "CommandOrControl+"
	}

	if (keys.altKey) {
		combo += "Alt+"
	}

	if (keys.shiftKey) {
		combo += "Shift+"
	}

	combo += keys.key.toUpperCase()

	return combo
}

const getRegisterredShortcut = (keys: KeysDown, state: WindowState) => {
	return state.application.commands.find(({ shortcut }) => shortcut === createAccelerator(keys))
}

export default registerIpcMainHandlers<ApplicationEvent>({
	"@application/get-state": () => {
		ipcMain.emit("send-state")
	},
	"@application/close-window": (_, __, context) => {
		context.window.close()
	},
	"@application/toggle-dev-tools": (state, __, context) => {
		state.application.showDevTools = !state.application.showDevTools
		context.window.webContents.toggleDevTools()
	},
	"@application/reload-window": (_, __, context) => {
		context.window.webContents.reload()
	},

	"@application/open-folder": async (state, _, context) => {
		const filePaths = context.dialog.showOpenDialogSync(context.window, {
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		})

		if (!filePaths) {
			return
		}

		ipcMain.emit("@activity-bar/open-editor")

		state.application.cwd = filePaths[0]
		state.application.tree = await listFolder(state.application.cwd)
	},
	"@application/open-file": async (state, path) => {
		if (!path || !state.application.tree) {
			return
		}

		const alreadyOpen = state.application.openFiles.findIndex((file) => file.path === path)

		if (~alreadyOpen) {
			if (state.application.currentFile !== alreadyOpen) {
				ipcMain.emit("@application/set-current-file", alreadyOpen)
			}

			return
		}

		const file = getFile(state.application.tree, path as string) as OpenOrdoFile

		if (!file) {
			return
		}

		file.body = (await readFile(file)).split("\n").map((line) => line.split("").concat([" "]))
		file.selection = {
			start: { line: 0, index: 0 },
			end: { line: 0, index: 0 },
			direction: "ltr",
		}

		state.application.openFiles.push(file)
		state.application.currentFile = state.application.openFiles.length - 1
	},
	"@application/set-current-file": (state, index) => {
		state.application.currentFile = index as number
	},
	"@application/close-file": (state, index) => {
		if (index == null) {
			index = state.application.currentFile
		}

		state.application.openFiles.splice(index as number, 1)

		if (state.application.currentFile === index) {
			if (state.application.currentFile > 0) {
				state.application.currentFile--
			} else {
				state.application.currentFile = 0
			}
		} else if (state.application.currentFile > index) {
			state.application.currentFile--
		}
	},
	"@application/save-file": async (draft) => {
		const file = draft.application.openFiles[draft.application.currentFile]

		if (!file) {
			return
		}

		await saveFile(
			file.path,
			file.body
				.map((line) => {
					let str = line.slice(0, -1).join("")

					while (str.endsWith(" ")) {
						str = str.slice(0, -1)
					}

					return str
				})
				.join("\n"),
		)

		const { size, mtime, atime } = await promises.stat(file.path)

		file.size = size
		file.updatedAt = mtime
		file.accessedAt = atime
	},
	"@editor/on-key-down": (draft, keys) => {
		const shortcut = getRegisterredShortcut(keys as KeysDown, draft)
		if (shortcut) {
			ipcMain.emit(shortcut.event[0])
			return
		}

		const handle = Switch.of((keys as KeysDown).key)
			.case("Dead", (tab: OpenOrdoFile) => tab)
			.case("ArrowUp", handleArrowUp)
			.case("ArrowDown", handleArrowDown)
			.case("ArrowLeft", handleArrowLeft)
			.case("ArrowRight", handleArrowRight)
			.case("Enter", handleEnter)
			.case("Backspace", handleBackspace)
			.case("Tab", handleTab)
			.default(handleTyping)

		handle(draft.application.openFiles[draft.application.currentFile], keys as any)

		// draft.application.openFiles[draft.application.currentFile] = handle(
		// 	draft.application.openFiles[draft.application.currentFile],
		// 	keys as KeysDown,
		// )
	},
	"@editor/on-mouse-up": (draft, selection) => {
		console.log(selection)
	},
})
