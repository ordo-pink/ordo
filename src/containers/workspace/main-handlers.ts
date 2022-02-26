import { registerEventHandlers } from "@core/register-ipc-main-handlers";
import { WorkspaceEvent } from "@containers/workspace/types";

export default registerEventHandlers<WorkspaceEvent>({
	"@workspace/set-component": ({ draft, payload: passed }) => void (draft.workspace.component = passed),
});
