import { Either } from "or-else";

import { OrdoEventHandler } from "@core/types";
import { registerEvents } from "@core/transmission/register-ordo-events";
import { internalSettingsStore } from "@core/settings/internal-settings";
import { SideBarEvents } from "@containers/side-bar/types";
import { FoldVoid, fromBoolean } from "@utils/either";
import { tap } from "@utils/functions";

/**
 * Triggers hiding the SideBar. This method does not change width of the SideBar so that it can be
 * reopened with the same width as it was before.
 */
const hideHandler: OrdoEventHandler<"@side-bar/hide"> = ({ draft }) => void (draft.sideBar.show = false);

/**
 * Triggers showing the SideBar. If SideBar width is set to be less than 1% of the screen width,
 * the width will be updated to take 20% of the screen size.
 */
const showHandler: OrdoEventHandler<"@side-bar/show"> = ({ draft, transmission }) =>
  Either.fromNullable(transmission.select((state) => state.sideBar.width))
    .chain((width) => fromBoolean(width <= 1))
    .map(() => (draft.sideBar.width = 20))
    .bimap(
      () => (draft.sideBar.show = true),
      () => (draft.sideBar.show = true),
    )
    .fold(...FoldVoid);

/**
 * Toggles the SideBar. It internally uses `@side-bar/show` and `@side-bar/hide events`, depending on the
 * current state of the SideBar.
 */
const toggleHandler: OrdoEventHandler<"@side-bar/toggle"> = ({ transmission }) =>
  fromBoolean(transmission.select((state) => state.sideBar.show))
    .bimap(
      () => transmission.emit("@side-bar/show", null),
      () => transmission.emit("@side-bar/hide", null),
    )
    .fold(...FoldVoid);

/**
 * Sets width of the SideBar. If the width set is under 1% of the screen, the SideBar is also marked hidden.
 */
const setWidthHandler: OrdoEventHandler<"@side-bar/set-width"> = ({ draft, payload }) =>
  Either.right(payload)
    .map(tap((p) => (draft.sideBar.width = p)))
    .map(tap((p) => internalSettingsStore.set("window.sideBarWidth", p)))
    .chain((p) => fromBoolean(p >= 1))
    .bimap(
      () => (draft.sideBar.show = false),
      () => (draft.sideBar.show = true),
    )
    .fold(...FoldVoid);

export default registerEvents<SideBarEvents>({
  "@side-bar/hide": hideHandler,
  "@side-bar/show": showHandler,
  "@side-bar/toggle": toggleHandler,
  "@side-bar/set-width": setWidthHandler,
});
