import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { ActivityBarEvent } from "./types"

export default registerIpcMainHandlers<ActivityBarEvent>({
	"@activity-bar/show": (draft) => void (draft.activities.show = true),
	"@activity-bar/hide": (draft) => void (draft.activities.show = false),
	"@activity-bar/toggle": (draft) => void (draft.activities.show = !draft.activities.show),
	"@activity-bar/select": (draft, name) => void (draft.activities.current = name),
})
