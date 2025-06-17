import { Maoka, maoka_dom } from "@ordo-pink/maoka"
import { maoka_sdk } from "@ordo-pink/sdk-maoka"

export const window_title_jab: Maoka.Jab = ({ use }) => {
	const { hunter } = use(maoka_sdk.context.consume)
	const translate = use(maoka_sdk.jabs.t$)

	const handle_onmount = () => {
		hunter.track("title.set_title", title => {
			const title_element = document.querySelector("title")
			if (title_element) title_element.innerText = translate(title) ?? "Ordo.pink"
		})
	}

	use(maoka_dom.jabs.onmount(handle_onmount))
}
