import { type TOrdoHooks } from "@ordo-pink/maoka-ordo-hooks"
import { create } from "@ordo-pink/maoka"

import { type TActivityHook } from "../../hooks/use-activities.hook"

const span = create<TActivityHook & TOrdoHooks>("span")

type P = Required<Pick<Functions.Activity, "name" | "render_icon">>
export const ActivityBarIcon = ({ name, render_icon }: P) =>
	span(use => {
		const element = use.get_current_element()
		const current_activity = use.current_activity().unwrap()

		const is_current = current_activity && current_activity.name === name

		use.set_attribute("class", is_current ? "text-pink-500" : "text-inherit")

		render_icon(element)
	})
