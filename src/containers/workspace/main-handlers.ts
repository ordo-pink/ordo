import { registerIpcMainHandlers } from "../../common/register-ipc-main-handlers"
import { WorkspaceEvent } from "./types"

export default registerIpcMainHandlers<WorkspaceEvent>({
	"@workspace/set-component": (draft, value) => void (draft.workspace.component = value as any),
})
