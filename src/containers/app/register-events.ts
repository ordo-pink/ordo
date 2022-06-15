import { BrowserWindow, nativeTheme } from "electron";
import { is } from "electron-util";
import { Either } from "or-else";

import { registerEvents } from "@core/transmission/register-ordo-events";
import { internalSettingsStore } from "@core/settings/internal-settings";
import { userSettingsStore } from "@core/settings/user-settings";
import { createWindow } from "@core/window/create-window";
import { OrdoEventHandler } from "@core/types";
import { AppEvents } from "@containers/app/types";
import { FoldVoid, fromBoolean } from "@utils/either";
import { noOpFn } from "@utils/no-op";
import { tap } from "@utils/functions";

/**
 * Sends a snapshot of the backend state to the frontend for synchronisation.
 */
const getStateHandler: OrdoEventHandler<"@app/get-state"> = ({ context, transmission }) => {
	context.window.webContents.send(
		"@app/set-state",
		transmission.select((state) => state),
	);
};

/**
 * Triggers closing currently focused window (if there is any).
 */
const closeWindowHandler: OrdoEventHandler<"@app/close-window"> = () => {
	Either.fromNullable(BrowserWindow.getFocusedWindow()).fold(noOpFn, (window) => window.close());
};

/**
 * Triggers creating a new window. This window exists completely separately from the other windows.
 */
const newWindowHandler: OrdoEventHandler<"@app/new-window"> = async () => {
	await createWindow();
};

/**
 * Triggers Electron browser window reload.
 */
const reloadWindowHandler: OrdoEventHandler<"@app/reload-window"> = ({ context }) => {
	context.window.reload();
};

/**
 * Triggers opening or closing dev tools. This action is only available if the application is in
 * development mode, and the process is run with a `--debug` option.
 */
const toggleDevToolsHandler: OrdoEventHandler<"@app/toggle-dev-tools"> = ({ context }) => {
	fromBoolean(is.development)
		.chain(() => fromBoolean(!process.argv.includes("--debug")))
		.fold(noOpFn, () => context.window.webContents.toggleDevTools());
};

/**
 * Triggers an open folder dialog to open a new folder in the focused window.
 */
const selectProjectHandler: OrdoEventHandler<"@app/select-project"> = async ({ draft, context, transmission }) => {
	Either.fromNullable(
		context.dialog.showOpenDialogSync({
			properties: ["openDirectory", "createDirectory", "promptToCreate"],
		}),
	)
		.map(([path]) => path)
		.map(tap((path) => (draft.app.currentProject = path)))
		.map(tap((path) => transmission.emit("@file-explorer/list-folder", path)))
		.map(tap(context.addRecentDocument))
		.map((path) => [path].concat(internalSettingsStore.get("window.recentProjects")))
		.map((projects) => projects.slice(0, 5))
		.map((projects) => new Set(projects))
		.map(Array.from)
		.map((projects) => transmission.emit("@app/set-internal-setting", ["window.recentProjects", projects]))
		.fold(...FoldVoid);
};

/**
 * Triggers syncrhonisation between state and internal settings store.
 */
const getInternalSettingsHandler: OrdoEventHandler<"@app/get-internal-settings"> = ({ draft }) => {
	draft.app.internalSettings = internalSettingsStore.store;
};

/**
 * Triggers an update to the internal settings store. The change is also applied to the state.
 */
const setInternalSettingHandler: OrdoEventHandler<"@app/set-internal-setting"> = ({ draft, payload }) => {
	internalSettingsStore.set(...payload);
	draft.app.internalSettings = internalSettingsStore.store;
};

/**
 * Triggers syncrhonisation between state and user settings store.
 */
const getUserSettingsHandler: OrdoEventHandler<"@app/get-internal-settings"> = ({ draft }) => {
	draft.app.userSettings = userSettingsStore.store;
};

/**
 * Triggers an update to the user settings store. The change is also applied to the state.
 */
const setUserSettingHandler: OrdoEventHandler<"@app/set-user-setting"> = ({ draft, payload, context }) => {
	userSettingsStore.set(...payload);

	if (payload[0] === "appearance.theme") {
		nativeTheme.themeSource = payload[1];
	}

	draft.app.userSettings = userSettingsStore.store;
};

/**
 * Registers a provided command in the TopBar command palette.w
 */
const registerCommandHandler: OrdoEventHandler<"@app/register-command"> = ({ draft, payload }) => {
	draft.app.commands.push(payload);
};

const handleUndo: OrdoEventHandler<"@app/undo"> = ({ transmission }) => {
	const tabs = transmission.select((state) => state.editor.tabs);
	const currentTab = transmission.select((state) => state.editor.currentTab);

	const tab = tabs.find((t) => t.path === currentTab);

	if (!tab) return;

	transmission.undo();
	transmission.emit("@file-explorer/save-file", { path: currentTab, content: tab.content.raw });
};
const handleRedo: OrdoEventHandler<"@app/redo"> = ({ transmission }) => {
	transmission.undo();
};

export default registerEvents<AppEvents>({
	"@app/get-state": getStateHandler,
	"@app/close-window": closeWindowHandler,
	"@app/new-window": newWindowHandler,
	"@app/reload-window": reloadWindowHandler,
	"@app/select-project": selectProjectHandler,
	"@app/toggle-dev-tools": toggleDevToolsHandler,
	"@app/get-internal-settings": getInternalSettingsHandler,
	"@app/set-internal-setting": setInternalSettingHandler,
	"@app/get-user-settings": getUserSettingsHandler,
	"@app/set-user-setting": setUserSettingHandler,
	"@app/register-command": registerCommandHandler,
	"@app/undo": handleUndo,
	"@app/redo": handleRedo,
});
