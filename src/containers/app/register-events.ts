import { BrowserWindow } from "electron";
import { is } from "electron-util";

import { AppEvents } from "@containers/app/types";
import { internalSettingsStore } from "@core/settings/internal-settings";
import { userSettingsStore } from "@core/settings/user-settings";
import { registerEvents } from "@core/transmission/register-ordo-events";
import { OrdoEventHandler } from "@core/types";
import { createWindow } from "@core/window/create-window";
import { Either } from "or-else";
import { noOpFn } from "@utils/no-op";
import { FoldVoid, fromBoolean } from "@utils/either";
import { tap } from "@utils/tap";

const getStateHandler: OrdoEventHandler<"@app/get-state"> = ({ context, transmission }) => {
	context.window.webContents.send(
		"@app/set-state",
		transmission.select((state) => state),
	);
};

const closeWindowHandler: OrdoEventHandler<"@app/close-window"> = () => {
	Either.fromNullable(BrowserWindow.getFocusedWindow()).fold(noOpFn, (window) => window.close());
};

const newWindowHandler: OrdoEventHandler<"@app/new-window"> = async () => {
	await createWindow();
};

const reloadWindowHandler: OrdoEventHandler<"@app/reload-window"> = ({ context }) => {
	context.window.reload();
};

const toggleDevToolsHandler: OrdoEventHandler<"@app/toggle-dev-tools"> = ({ context }) => {
	fromBoolean(is.development)
		.chain(() => fromBoolean(!process.argv.includes("--debug")))
		.fold(noOpFn, () => context.window.webContents.toggleDevTools());
};

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

const getInternalSettingsHandler: OrdoEventHandler<"@app/get-internal-settings"> = ({ draft }) => {
	draft.app.internalSettings = internalSettingsStore.store;
};

const setInternalSettingHandler: OrdoEventHandler<"@app/set-internal-setting"> = ({ draft, payload }) => {
	internalSettingsStore.set(...payload);
	draft.app.internalSettings = internalSettingsStore.store;
};

const getUserSettingsHandler: OrdoEventHandler<"@app/get-internal-settings"> = ({ draft }) => {
	draft.app.userSettings = userSettingsStore.store;
};

const setUserSettingHandler: OrdoEventHandler<"@app/set-user-setting"> = ({ draft, payload }) => {
	userSettingsStore.set(...payload);
	draft.app.userSettings = userSettingsStore.store;
};

const registerCommandHandler: OrdoEventHandler<"@app/register-command"> = ({ draft, payload }) => {
	draft.app.commands.push(payload);
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
});
