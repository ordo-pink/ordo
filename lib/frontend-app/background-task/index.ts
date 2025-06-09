import { BACKGROUND_TASK, type Client } from "@ordo-pink/sdk-client"
import { type Maoka, maoka_dom } from "@ordo-pink/maoka"
import { context } from "@ordo-pink/sdk-maoka"
import { create_zags } from "@ordo-pink/zags"

import { background_task_status } from "./components/background-task-status.component"

import "./background-task.styles.css"

export const create_background_task_status_jab: Maoka.Jab<() => Maoka.Component> = ({ use }) => {
	const { hunter } = use(context.consume)

	const handle_onmount = () => {
		const release_loading = hunter.track("background_status.loading", handle_loading)
		const release_none = hunter.track("background_status.none", handle_none)
		const release_saving = hunter.track("background_status.saving", handle_saving)

		return () => {
			release_loading()
			release_none()
			release_saving()
		}
	}

	use(maoka_dom.jabs.onmount(handle_onmount))

	return () => background_task_status({ $: background_task$ })
}

// --- Internal ---

const background_task$ = create_zags({ status: BACKGROUND_TASK.STATUS.NONE })

const handle_saving: Client.GunFor<"background_status.saving"> = () =>
	background_task$.update("status", () => BACKGROUND_TASK.STATUS.SAVING)

const handle_none: Client.GunFor<"background_status.none"> = () =>
	background_task$.update("status", () => BACKGROUND_TASK.STATUS.NONE)

const handle_loading: Client.GunFor<"background_status.loading"> = () =>
	background_task$.update("status", () => BACKGROUND_TASK.STATUS.LOADING)
