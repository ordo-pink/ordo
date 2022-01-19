import { original } from "immer"
import { registerIpcMainHandlers } from "../common/register-ipc-main-handlers"
import { ApplicationEvent } from "./types"

export default registerIpcMainHandlers<ApplicationEvent>({
	"@application/get-state": (state, _, context) => {
		context.window.webContents.send("apply-state-patches", original(state))
	},
})
