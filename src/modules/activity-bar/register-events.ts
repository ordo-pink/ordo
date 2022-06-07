import { registerEvents } from "@core/transmission/register-ordo-events";
import { OrdoEventHandler } from "@core/types";
import { OrdoEvents } from "@init/types";
import { ActivityBarEvents } from "@modules/activity-bar/types";

const handleSelect: OrdoEventHandler<"@activity-bar/select"> = ({ draft, payload }) => {
	draft.activityBar.current = payload;
};

const handleOpen =
	<T extends keyof OrdoEvents>(activity: string, showSidebar = false): OrdoEventHandler<T> =>
	({ transmission }) => {
		transmission.emit(showSidebar ? "@side-bar/show" : "@side-bar/hide", null);
		transmission.emit("@activity-bar/select", activity);
	};

const handleOpenEditor = handleOpen<"@activity-bar/open-editor">("Editor", true);
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
