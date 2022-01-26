import { registerEventHandlers } from "../../common/register-ipc-main-handlers"

export default registerEventHandlers({
	"@workspace/set-component": ({ draft, passed }) => void (draft.workspace.component = passed as any),
})
