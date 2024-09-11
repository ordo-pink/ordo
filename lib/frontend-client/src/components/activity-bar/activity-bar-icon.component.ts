import { create, set_attribute } from "@ordo-pink/maoka"

type P = Required<Pick<Functions.Activity, "name" | "render_icon">> & {
	current_activity?: Functions.Activity["name"]
}
export const ActivityBarIcon = ({ name, render_icon, current_activity }: P) =>
	create("span", ({ use, get_current_element }) => {
		const element = get_current_element()

		const is_current = !!current_activity && current_activity === name

		use(set_attribute("class", is_current ? "text-pink-500" : "text-inherit"))

		render_icon(element)
	})
