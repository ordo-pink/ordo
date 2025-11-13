import { bs_x } from "@ordo-pink/frontend-icons"
import { maoka } from "@ordo-pink/oss-maoka"
import { maoka_dom } from "@ordo-pink/oss-maoka/dom"
import { sweech } from "@ordo-pink/oss-sweech"
import { zags } from "@ordo-pink/oss-zags"

import "./modal.styles.css"

export const modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)

	use(ordo_client_maoka.jabs.set_class("modal_wrapper"))
	use(ordo_client_maoka.jabs.listen("onclick", () => handle_click()))
	use(maoka_dom.jabs.onmount(() => handle_mount()))

	const handle_show = () => use(ordo_client_maoka.jabs.add_class("active"))
	const handle_hide = () => use(ordo_client_maoka.jabs.remove_class("active"))
	const handle_click = () => hunter.shoot("modal.hide")
	const handle_mount = () => {
		const divorce_modal = modal$.cheat("instance", instance => (instance ? handle_show() : handle_hide()))

		const release_show = hunter.track("modal.show", params => modal$.update("instance", () => params))
		const release_hide = hunter.track("modal.hide", () => modal$.update("instance", () => void 0))

		hunter.shoot("i18n.add_translations", {
			locale: "en",
			values: { modal_close_hint: "Click here, or anywhere else outside the modal window, or press Escape to close." },
		})

		return () => {
			divorce_modal()
			release_hide()
			release_show()
		}
	}

	return () => [modal_window(), close_modal()]
})

// --- Internal ---

const modal$ = zags.create<{ instance?: OrdoClient.Modal.Instance }>({})

const modal_window = maoka.create("div", ({ use }) => {
	let onunmount: (() => void) | undefined

	const get_modal_instance = use(ordo_client_maoka.jabs.cheat$(modal$, "instance"))

	use(ordo_client_maoka.jabs.set_class("modal"))
	use(ordo_client_maoka.jabs.listen("onclick", event => event.stopPropagation()))

	return () => {
		const modal_instance = get_modal_instance()

		if (onunmount) {
			onunmount()
			onunmount = undefined
		}

		if (modal_instance) {
			if (modal_instance.onunmount) onunmount = modal_instance.onunmount
			if (modal_instance.size != null) use(ordo_client_maoka.jabs.add_class(modal_size_to_class(modal_instance.size)))

			return content_wrapper()
		} else {
			use(maoka_dom.jabs.if_dom(n => (n.value.innerHTML = "")))
		}
	}
})

const content_wrapper = maoka.create("div", ({ use }) => {
	const modal_instance = modal$.select("instance")

	use(maoka_dom.jabs.if_dom(n => void modal_instance!.render(n.value as HTMLDivElement)))
})

const modal_size_to_class = (size: OrdoClient.Modal.Size) =>
	sweech
		.match(size)
		.case(ORDO_CLIENT.MODAL.SIZE.SM, () => "sm")
		.case(ORDO_CLIENT.MODAL.SIZE.MD, () => "md")
		.case(ORDO_CLIENT.MODAL.SIZE.LG, () => "lg")
		.case(ORDO_CLIENT.MODAL.SIZE.XL, () => "xl")
		.default(() => "2xl")

const close_modal = maoka.create("div", ({ use }) => {
	const { hunter } = use(ordo_client_maoka.context.consume)
	const translate = use(ordo_client_maoka.jabs.translate$)

	use(ordo_client_maoka.jabs.set_class("modal_close"))
	use(ordo_client_maoka.jabs.listen("onclick", () => handle_click()))
	use(ordo_client_maoka.jabs.listen_global_event("keydown", e => handle_global_esc(e)))

	const handle_global_esc = (event: KeyboardEvent) => {
		if (event.code !== "Escape" || !modal$.select("instance")) return

		event.stopImmediatePropagation()
		hunter.shoot("modal.hide")
	}

	const handle_click = () => void hunter.shoot("modal.hide")

	return () => {
		use(ordo_client_maoka.jabs.set_attribute("title", translate("modal_close_hint")))

		return bs_x()
	}
})
