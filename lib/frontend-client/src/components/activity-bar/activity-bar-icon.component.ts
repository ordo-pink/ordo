import { Maoka } from "@ordo-pink/maoka"

type P = Required<Pick<Ordo.Activity.Instance, "name" | "render_icon">> & {
	current_activity_name?: Ordo.Activity.Instance["name"]
}
export const ActivityBarIcon = ({ name, render_icon, current_activity_name }: P) =>
	Maoka.create("span", ({ use, current_element }) => {
		const is_current = !!current_activity_name && current_activity_name === name

		use(Maoka.hooks.set_attribute("class", is_current ? "text-pink-500" : "text-inherit"))

		render_icon(current_element)
	})
