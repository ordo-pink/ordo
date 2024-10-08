import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

type P = Required<Pick<Ordo.Activity.Instance, "name" | "render_icon">> & {
	current_activity_name?: Ordo.Activity.Instance["name"]
}
export const ActivityBarIcon = ({ name, render_icon, current_activity_name }: P) =>
	Maoka.create("span", async ({ use, element }) => {
		const is_current = !!current_activity_name && current_activity_name === name

		use(MaokaJabs.set_class("activity-bar_icon"))

		if (is_current) use(MaokaJabs.add_class("active"))
		else use(MaokaJabs.remove_class("active"))

		await render_icon(element as HTMLSpanElement)
	})
