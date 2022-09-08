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

  const settingKey = payload[0];
  const settingValue = payload[1];

  const isChangingAppTheme = settingKey === "appearance.theme";

  if (isChangingAppTheme) {
    // Also inform all browser windows that they should change native theme.
    nativeTheme.themeSource = settingValue;
  }

  draft.app.userSettings = userSettingsStore.store;
};
