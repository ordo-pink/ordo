import { registerEventHandlers } from "../../common/register-ipc-main-handlers";
import { SidebarEvent } from "./types";

export default registerEventHandlers<SidebarEvent>({
	"@sidebar/set-component": ({ draft, payload }) => void (draft.sidebar.component = payload),
	"@sidebar/set-width": ({ draft, payload }) => void (draft.sidebar.width = payload),
	"@sidebar/show": ({ draft }) => void (draft.sidebar.width = 25),
	"@sidebar/hide": ({ draft }) => void (draft.sidebar.width = 0),
	"@sidebar/toggle": ({ draft }) => void (draft.sidebar.width = draft.sidebar.width > 0 ? 0 : 25),
});
