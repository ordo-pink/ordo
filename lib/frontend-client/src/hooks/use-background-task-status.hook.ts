import { type Observable } from "rxjs"

import { BackgroundTaskStatus } from "@ordo-pink/core"
import { type TInitHook } from "@ordo-pink/maoka"

export type TBackgroundTaskStatusHook = {
	background_task_status: () => BackgroundTaskStatus
}

export const init_background_task_status_hook = (
	background_task$: Observable<BackgroundTaskStatus>,
): TInitHook<TBackgroundTaskStatusHook> => ({
	background_task_status: use => {
		let current_status = BackgroundTaskStatus.NONE

		return () => {
			use.on_mount(() => {
				const subscription = background_task$.subscribe(value => {
					if (current_status !== value) {
						current_status = value
						use.refresh()
					}
				})

				return () => {
					subscription.unsubscribe()
				}
			})

			return current_status
		}
	},
})
