import { registerEventHandlers } from "../../common/register-ipc-main-handlers";
import { WorkspaceEvent } from "./types";

export default registerEventHandlers<WorkspaceEvent>({
	"@workspace/set-component": ({ draft, payload: passed }) => void (draft.workspace.component = passed),
});
