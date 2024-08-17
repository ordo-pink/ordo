import { type Observable } from "rxjs"
import { equals } from "ramda"

import { O, type TOption } from "@ordo-pink/option"
import { type TInitHook } from "@ordo-pink/maoka"
import { is_fn } from "@ordo-pink/tau"

export type TActivityHook = {
	current_activity: () => TOption<Functions.Activity>
	activities: () => Functions.Activity[]
}

type P = {
	current_activity$: Observable<TOption<Functions.Activity>>
	activities$: Observable<Functions.Activity[]>
}
export const init_activities_hook = ({
	current_activity$,
	activities$,
}: P): TInitHook<TActivityHook> => ({
	current_activity: use => {
		let current_activity: TOption<Functions.Activity> = O.None()

		return () => {
			use.on_mount(() => {
				const current_activity_sub = current_activity$.subscribe(value => {
					if (
						current_activity.is_some !== value.is_some ||
						current_activity.unwrap()?.name !== value.unwrap()?.name
					) {
						current_activity = value
						use.refresh()
					}
				})

				return () => {
					current_activity_sub.unsubscribe()
				}
			})

			return current_activity
		}
	},
	activities: use => {
		let registerred_activities: Functions.Activity[] = []

		return () => {
			use.on_mount(() => {
				const activities_sub = activities$.subscribe(value => {
					const activities = value.filter(i => !i.is_background && is_fn(i.render_icon))

					if (
						activities.length !== registerred_activities.length ||
						!equals(activities, registerred_activities)
					) {
						registerred_activities = activities
						use.refresh()
					}
				})

				return () => {
					activities_sub.unsubscribe()
				}
			})

			return registerred_activities
		}
	},
})
