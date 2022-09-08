import { internalSettingsStore } from "@core/settings/internal-settings";
import { OrdoEventHandler } from "@core/types";

/**
 * Sets width of the SideBar. If the width set is under 1% of the screen, the SideBar is also marked hidden.
 */
export const handleSetWidth: OrdoEventHandler<"@side-bar/set-width"> = ({ draft, payload }) => {
  const width = payload <= 1 ? 0 : payload;

  draft.sideBar.width = width;
  draft.sideBar.isShown = Boolean(width);

  internalSettingsStore.set("window.sideBarWidth", width);
};
