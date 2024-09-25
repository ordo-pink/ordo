import { Maoka } from "@ordo-pink/maoka"

type P = Required<Pick<Functions.Activity, "name" | "render_icon">> & {
	current_activity?: Functions.Activity["name"]
}
export const ActivityBarIcon = ({ name, render_icon, current_activity }: P) =>
	Maoka.create("span", ({ use, current_element }) => {
		const is_current = !!current_activity && current_activity === name

		use(Maoka.hooks.set_attribute("class", is_current ? "text-pink-500" : "text-inherit"))

		render_icon(current_element)
	})
