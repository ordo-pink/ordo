import type { ColorTheme } from "./apis/appearance/types"
import { app, BrowserWindow, dialog, ipcMain, shell } from "electron"
import { join, normalize, resolve } from "path"
import { debounce } from "../utils/function"
import { Settings } from "./apis/settings"
import { getMarkdownFile } from "./apis/fs/get-markdown-file"
import { listFolder } from "./apis/fs/list-folder"
import { saveFile } from "./apis/fs/save-file"
import { setTheme } from "./apis/appearance"
import { move } from "./apis/fs/move"
import { createFile } from "./apis/fs/create-file"
import { createFolder } from "./apis/fs/create-folder"
import { findFileBySubPath } from "./apis/fs/find-file-by-subpath"
import { OrdoFolder, OrdoFile } from "../global-context/types"

declare const MAIN_WINDOW_WEBPACK_ENTRY: string
declare const MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY: string

const getAbsolute = (path: string) => {
	return resolve(path) === normalize(path)
		? path
		: join(Settings.get("application.root-folder-path"), path)
}

const visitFile = (tree: OrdoFolder, cb: (x: OrdoFile) => void) => {
	tree.children.forEach((child) => {
		if (child.isFile) {
			cb(child)
		} else {
			visitFile(child as OrdoFolder, cb)
		}
	})
}

const settingsFilePath = join(app.getPath("userData"), "configuration.yaml")

Settings.loadFromFile(settingsFilePath)

if (!Settings.get("application.global-settings-path")) {
	Settings.set("application.global-settings-path", settingsFilePath).persist(settingsFilePath)
}

ipcMain.handle("dark-mode:set", (_, theme): ColorTheme => setTheme(theme))

ipcMain.handle("fs:list-folder", async (_, path) => {
	const tree = await listFolder(getAbsolute(path))

	// const tags: any[] = []
	// const links: any[] = []

	visitFile(tree, (file) => {
		if (file.extension === ".md") {
			// const ast = parseMarkdown(tokenizeMarkdown((file as MDFile).body))
			// visit(ast)(AstNodeType.TAG, (node) => {
			// 	let tag: any = tags.find((tag) => tag.name === (node.raw as any))
			// 	if (!tag) {
			// 		tag = { name: node.raw, children: [], id: node.raw }
			// 		tags.push(tag)
			// 	}
			// 	tag.children.push(file)
			// })
			// visit(ast)(AstNodeType.WIKI_LINK, (node) => {
			// 	const link = node.raw.slice(2, -2)
			// 	if (link.startsWith("http:") || link.startsWith("https:")) {
			// 		return
			// 	}
			// 	if (link.startsWith("/")) {
			// 		links.push({
			// 			source: file.path,
			// 			target: link,
			// 			exists: Boolean(findFileByPath(tree, link)),
			// 			type: "wiki-link",
			// 		})
			// 	}
			// 	const linkPath = resolve(tree.path, `${link}.md`)
			// 	links.push({
			// 		source: file.path,
			// 		target: linkPath,
			// 		exists: Boolean(findFileByPath(tree, linkPath)),
			// 		type: "wiki-link",
			// 	})
			// })
			// visit(ast)(AstNodeType.EMBEDDED_WIKI_LINK, (node) => {
			// 	const link = node.raw.trim().slice(3, -2)
			// 	if (link.startsWith("http:") || link.startsWith("https:")) {
			// 		return
			// 	}
			// 	if (link.startsWith("/")) {
			// 		links.push({
			// 			source: file.path,
			// 			target: link,
			// 			exists: Boolean(findFileByPath(tree, link)),
			// 			type: "wiki-link",
			// 		})
			// 	}
			// 	const linkPath = resolve(tree.path, `${link}.md`)
			// 	links.push({
			// 		source: file.path,
			// 		target: linkPath,
			// 		exists: Boolean(findFileByPath(tree, linkPath)),
			// 		type: "embedded-wiki-link",
			// 	})
			// })
		}
	})

	// tree.tags = tags
	// tree.links = links

	return tree
})
ipcMain.handle("fs:get-file", async (_, path) => getMarkdownFile(getAbsolute(path)))
ipcMain.handle("fs:save-file", (_, path, data) => saveFile(getAbsolute(path), data))
ipcMain.handle("fs:move", (_, oldPath, newPath) => move(getAbsolute(oldPath), getAbsolute(newPath)))
ipcMain.handle("fs:create-file", (_, folder, name) => createFile(folder, name))
ipcMain.handle("fs:create-folder", (_, folder, name) => createFolder(folder, name))
ipcMain.handle("fs:find-file-by-subpath", (_, subPath) =>
	listFolder(Settings.get("application.root-folder-path")).then((f) =>
		findFileBySubPath(subPath, f),
	),
)

ipcMain.handle("settings:set", (_, key, value) => {
	Settings.set(key, value).persist(Settings.get("application.global-settings-path"))
})
ipcMain.handle("settings:get", (_, key) => Settings.get(key))

ipcMain.handle("shell:open-external", (_, url) => shell.openExternal(url))

const createWindow = (): void => {
	const mainWindow = new BrowserWindow({
		width: Settings.get("window.main-window.width"),
		height: Settings.get("window.main-window.height"),
		x: Settings.get("window.main-window.x"),
		y: Settings.get("window.main-window.y"),
		webPreferences: {
			sandbox: true,
			contextIsolation: true,
			nodeIntegration: false,
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
		},
	})

	mainWindow.on(
		"resize",
		debounce(() => {
			const bounds = mainWindow.getBounds()

			Settings.set("window.main-window.height", bounds.height)
				.set("window.main-window.width", bounds.width)
				.set("window.main-window.x", bounds.x)
				.set("window.main-window.y", bounds.y)
				.persist(Settings.get("application.global-settings-path"))
		}, 300),
	)

	ipcMain.handle("fs:delete", async (_, path: string): Promise<boolean> => {
		const response = dialog.showMessageBoxSync(mainWindow, {
			type: "question",
			buttons: ["Yes", "No"],
			title: "Confirm removal",
			message: `Are you sure you want to remove "${path}"`,
		})

		if (response === 0) {
			return shell.trashItem(path).then(() => response === 0)
		}

		return response === 0
	})

	ipcMain.handle("fs:select-root-folder", () =>
		dialog
			.showOpenDialog(mainWindow, {
				properties: ["openDirectory", "createDirectory", "promptToCreate"],
			})
			.then(({ filePaths }) => {
				Settings.set("application.root-folder-path", filePaths[0])
					.set("application.last-open-file", "")
					.persist(Settings.get("application.global-settings-path"))

				return filePaths[0]
			}),
	)

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY)
}

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (require("electron-squirrel-startup")) {
	app.quit()
}

app
	.on("ready", createWindow)
	.on("window-all-closed", () => process.platform !== "darwin" && app.quit())
	.on("activate", () => BrowserWindow.getAllWindows().length === 0 && createWindow())
