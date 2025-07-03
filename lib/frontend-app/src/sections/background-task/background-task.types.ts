import type { BACKGROUND_TASK } from "@ordo-pink/sdk-client"

export namespace BackgroundTask {
	export type State = {
		status: BACKGROUND_TASK.STATUS
	}
}
