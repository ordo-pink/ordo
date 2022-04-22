import { AppEvents } from "@containers/app/types";
import { internalSettingsStore } from "@core/settings/internal-settings";
import { userSettingsStore } from "@core/settings/user-settings";
import { registerEvents } from "@core/transmission/register-ordo-events";
import { OrdoEventHandler } from "@core/types";
import { createWindow } from "@core/window/create-window";
import { BrowserWindow } from "electron";
import { is } from "electron-util";

const getStateHandler: OrdoEventHandler<"@app/get-state"> = ({ context, transmission }) => {
	context.window.webContents.send(
		"@app/set-state",
		transmission.select((state) => state),
	);
};

const closeWindowHandler: OrdoEventHandler<"@app/close-window"> = () => {
	BrowserWindow.getFocusedWindow()?.close();
};

const newWindowHandler: OrdoEventHandler<"@app/new-window"> = async () => {
	await createWindow();
};

const reloadWindowHandler: OrdoEventHandler<"@app/reload-window"> = ({ context }) => {
	context.window.reload();
};

const toggleDevToolsHandler: OrdoEventHandler<"@app/toggle-dev-tools"> = ({ context }) => {
	if (!is.development || !process.argv.includes("--debug")) {
		return;
	}

	context.window.webContents.toggleDevTools();
};

const selectProjectHandler: OrdoEventHandler<"@app/select-project"> = async ({ draft, context, transmission }) => {
	const paths = context.dialog.showOpenDialogSync({
		properties: ["openDirectory", "createDirectory", "promptToCreate"],
	});

	if (paths && paths[0]) {
		draft.app.currentProject = paths[0];
		await transmission.emit("@file-explorer/list-folder", paths[0]);
		await transmission.emit("@app/set-internal-setting", [
			"window.recentProjects",
			Array.from(new Set([paths[0]].concat(internalSettingsStore.get("window.recentProjects")))).slice(0, 8),
		]);

		context.addRecentDocument(paths[0]);
	}
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
