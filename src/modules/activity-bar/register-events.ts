import { registerEvents } from "@core/transmission/register-ordo-events";
import { ActivityBarEvents } from "@modules/activity-bar/types";

export default registerEvents<ActivityBarEvents>({
	"@activity-bar/select": ({ draft, payload }) => {
		draft.activityBar.current = payload;
	},
	"@activity-bar/open-editor": ({ transmission }) => {
		transmission.emit("@activity-bar/select", "Editor").then((t) => t.emit("@side-bar/show", null));
	},
	"@activity-bar/open-graph": ({ transmission }) => {
		transmission.emit("@activity-bar/select", "Graph");
	},
	"@activity-bar/open-settings": ({ transmission }) => {
		transmission.emit("@side-bar/hide", null);
		transmission.emit("@activity-bar/select", "Settings");
	},
});
