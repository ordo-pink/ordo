import { OrdoEventHandler } from "@core/types";

/**
 * Toggles the SideBar. It internally uses `@side-bar/show` and `@side-bar/hide events`, depending on the
 * current state of the SideBar.
 */
export const handleToggle: OrdoEventHandler<"@side-bar/toggle"> = ({ transmission }) => {
  const isShown = transmission.select((state) => state.sideBar.isShown);

  const eventName = isShown ? "@side-bar/hide" : "@side-bar/show";

  transmission.emit(eventName, null);
};
