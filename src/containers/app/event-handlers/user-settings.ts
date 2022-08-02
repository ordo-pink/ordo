import { nativeTheme } from "electron";

import { userSettingsStore } from "@core/settings/user-settings";
import { OrdoEventHandler } from "@core/types";

/**
 * Triggers syncrhonisation between state and user settings store.
 */
export const handleGetUserSettings: OrdoEventHandler<"@app/get-internal-settings"> = ({ draft }) => {
	draft.app.userSettings = userSettingsStore.store;
};

/**
 * Triggers an update to the user settings store. The change is also applied to the state.
 */
export const handleSetUserSetting: OrdoEventHandler<"@app/set-user-setting"> = ({ draft, payload, context }) => {
	userSettingsStore.set(...payload);

	if (payload[0] === "appearance.theme") {
		nativeTheme.themeSource = payload[1];
	}

	draft.app.userSettings = userSettingsStore.store;
};
