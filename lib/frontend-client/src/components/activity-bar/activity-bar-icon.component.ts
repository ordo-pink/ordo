import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

type P = Required<Pick<Ordo.Activity.Instance, "name" | "render_icon">> & {
	current_activity_name?: Ordo.Activity.Instance["name"]
}
export const ActivityBarIcon = ({ name, render_icon, current_activity_name }: P) =>
	Maoka.create("span", async ({ use, element }) => {
		const is_current = !!current_activity_name && current_activity_name === name

		use(MaokaJabs.set_attribute("class", is_current ? "text-pink-500" : "text-inherit"))

		await render_icon(element as HTMLSpanElement)
	})
