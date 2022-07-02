import { registerEvents } from "@core/transmission/register-ordo-events";
import { OrdoEventHandler } from "@core/types";
import { OrdoEvents } from "@init/types";
import { ActivityBarEvents } from "@modules/activity-bar/types";

const handleSelect: OrdoEventHandler<"@activity-bar/select"> = ({ draft, payload, transmission }) => {
	if (payload === "Editor") {
		transmission.emit("@side-bar/show", null);
	} else {
		transmission.emit("@side-bar/hide", null);
	}

	draft.activityBar.current = payload;
};

const handleOpen =
	<T extends keyof OrdoEvents>(activity: string): OrdoEventHandler<T> =>
	({ transmission }) => {
		transmission.emit("@activity-bar/select", activity);
	};

const handleOpenEditor = handleOpen<"@activity-bar/open-editor">("Editor");
const handleOpenGraph = handleOpen<"@activity-bar/open-graph">("Graph");
const handleOpenSettings = handleOpen<"@activity-bar/open-settings">("Settings");
const handleOpenCheckboxes = handleOpen<"@activity-bar/open-checkboxes">("Checkboxes");
const handleOpenWelcomePage = handleOpen<"@activity-bar/open-welcome-page">("WelcomePage");

export default registerEvents<ActivityBarEvents>({
	"@activity-bar/select": handleSelect,
	"@activity-bar/open-editor": handleOpenEditor,
	"@activity-bar/open-graph": handleOpenGraph,
	"@activity-bar/open-welcome-page": handleOpenWelcomePage,
	"@activity-bar/open-settings": handleOpenSettings,
	"@activity-bar/open-checkboxes": handleOpenCheckboxes,
});
