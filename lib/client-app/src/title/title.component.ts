import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"

export const title = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const translate = use(ordo_client_maoka.jabs.translate$)
	const title_element = document.querySelector("title")

	use(maoka_dom.jabs.onmount(() => handle_mount()))

	const handle_mount = () =>
		hunter.track("title.set_title", title => {
			if (title_element) {
				const title_str = title ? translate(title) : "404"

				title_element.innerHTML = `${title_str} | Ordo.pink`
			}
		})
})
