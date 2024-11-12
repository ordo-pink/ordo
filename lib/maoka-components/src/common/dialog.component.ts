import { Maoka, type TMaokaChildren } from "@ordo-pink/maoka"
import { Button } from "@ordo-pink/maoka-components"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./dialog.css"

type TDialogParams = {
	title: string
	custom_class?: string
	render_icon?: (div: HTMLDivElement) => void
	body: () => TMaokaChildren
	action: () => void
	action_text: string
	action_hotkey?: string
}

export const Dialog = ({
	title,
	custom_class = "",
	body,
	action,
	render_icon,
	action_text,
	action_hotkey = "enter",
}: TDialogParams) =>
	Maoka.create("div", ({ use }) => {
		use(MaokaJabs.set_class("dialog", custom_class))

		const Icon = render_icon
			? Maoka.create("div", ({ element }) => render_icon(element as unknown as HTMLDivElement))
			: void 0

		return () => [
			Header(() => [Icon, Title(() => title)]),
			Body(body),
			Footer(() =>
				Button.Success({
					on_click: action,
					text: action_text,
					hotkey: action_hotkey,
				}),
			),
		]
	})

const Header = Maoka.styled("div", { class: "dialog_header" })
const Title = Maoka.styled("h2", { class: "dialog_title" })
const Body = Maoka.styled("div")
const Footer = Maoka.styled("div", { class: "dialog_footer" })
