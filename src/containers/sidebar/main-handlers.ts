import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { SidebarEvent } from "./types"

export default registerIpcMainHandlers<SidebarEvent>({
	"@sidebar/set-component": (draft, value) => void (draft.sidebar.component = value as any),
	"@sidebar/set-width": (draft, value) => void (draft.sidebar.width = value as any),
	"@sidebar/show": (draft) => void (draft.sidebar.width = 25),
	"@sidebar/hide": (draft) => void (draft.sidebar.width = 0),
	"@sidebar/toggle": (draft) => void (draft.sidebar.width = draft.sidebar.width > 0 ? 0 : 25),
})
