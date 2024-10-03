import { Maoka } from "@ordo-pink/maoka"
import { MaokaHooks } from "@ordo-pink/maoka-hooks"

type P = Required<Pick<Ordo.Activity.Instance, "name" | "render_icon">> & {
	current_activity_name?: Ordo.Activity.Instance["name"]
}
export const ActivityBarIcon = ({ name, render_icon, current_activity_name }: P) =>
	Maoka.create("span", ({ use, element }) => {
		const is_current = !!current_activity_name && current_activity_name === name

		use(MaokaHooks.set_attribute("class", is_current ? "text-pink-500" : "text-inherit"))

		render_icon(element as HTMLSpanElement)
	})
