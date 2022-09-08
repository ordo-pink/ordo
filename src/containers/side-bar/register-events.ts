import { Either } from "or-else";

import { registerEvents } from "@core/transmission/register-ordo-events";
import { SideBarEvents } from "@containers/side-bar/types";
import { handleHide } from "@containers/side-bar/event-handlers/hide";
import { handleShow } from "@containers/side-bar/event-handlers/show";
import { handleToggle } from "@containers/side-bar/event-handlers/toggle";
import { handleSetWidth } from "@containers/side-bar/event-handlers/set-width";

export default registerEvents<SideBarEvents>({
  "@side-bar/hide": handleHide,
  "@side-bar/show": handleShow,
  "@side-bar/toggle": handleToggle,
  "@side-bar/set-width": handleSetWidth,
});
