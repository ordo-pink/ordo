import { internalSettingsStore } from "@core/settings/internal-settings";
import { OrdoEventHandler } from "@core/types";

/**
 * Triggers sync between state and internal settings store.
 */
export const hangleGetInternalSettings: OrdoEventHandler<"@app/get-internal-settings"> = ({ draft }) => {
  draft.app.internalSettings = internalSettingsStore.store;
};

/**
 * Triggers an update to the internal settings store. The change is also applied to the state.
 */
export const handleSetInternalSetting: OrdoEventHandler<"@app/set-internal-setting"> = ({ draft, payload }) => {
  internalSettingsStore.set(...payload);

  draft.app.internalSettings = internalSettingsStore.store;
};
