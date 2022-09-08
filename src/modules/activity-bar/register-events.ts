import { registerEvents } from "@core/transmission/register-ordo-events";
import { ActivityBarEvents } from "@modules/activity-bar/types";
import { handleOpen } from "@modules/activity-bar/event-handlers/open";
import { handleSelect } from "@modules/activity-bar/event-handlers/select";

export default registerEvents<ActivityBarEvents>({
  "@activity-bar/select": handleSelect,
  "@activity-bar/open-editor": handleOpen("Editor"),
  "@activity-bar/open-graph": handleOpen("Graph"),
  "@activity-bar/open-welcome-page": handleOpen("WelcomePage"),
  "@activity-bar/open-settings": handleOpen("Settings"),
  "@activity-bar/open-checkboxes": handleOpen("Checkboxes"),
});
