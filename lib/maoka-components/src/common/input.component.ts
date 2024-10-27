import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./input.css"

type TInputProps = {
	initial_value?: string
	on_input?: (event: Event) => void
	placeholder?: string
	label?: string
	custom_class?: string
}
const Text = ({
	label = "",
	on_input = () => void 0,
	placeholder = "",
	initial_value = "",
	custom_class = "",
}: TInputProps) =>
	Maoka.create("label", () => {
		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("input_label"))
				return () => label
			}),

			Maoka.create("input", ({ use, element }) => {
				use(MaokaJabs.listen("oninput", on_input))
				use(MaokaJabs.set_attribute("type", "text"))
				use(MaokaJabs.set_attribute("autofocus", "autofocus"))
				use(MaokaJabs.set_attribute("placeholder", placeholder))
				use(MaokaJabs.set_attribute("value", initial_value))
				use(MaokaJabs.set_class("input_text", custom_class))

				if (element instanceof HTMLElement) element.focus()
			}),
		]
	})

export const Input = {
	Text,
}
