import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"

import "./input.css"

type TInputProps = {
	initial_value?: string
	on_input?: (event: Event) => void
	placeholder?: string
	label?: string
	custom_class?: string
	autofocus?: boolean
}
const Text = ({
	label = "",
	on_input = () => void 0,
	placeholder = "",
	initial_value = "",
	custom_class = "",
	autofocus = false,
}: TInputProps) =>
	Maoka.create("label", () => {
		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("input_label"))
				return () => label
			}),

			Maoka.create("input", ({ use, element, after_mount }) => {
				use(MaokaJabs.listen("oninput", on_input))
				use(MaokaJabs.set_attribute("type", "text"))

				if (custom_class) use(MaokaJabs.set_class("input_text", custom_class))
				if (initial_value) use(MaokaJabs.set_attribute("value", initial_value))
				if (placeholder) use(MaokaJabs.set_attribute("placeholder", placeholder))
				if (autofocus) after_mount(() => element instanceof HTMLElement && element.focus())
			}),
		]
	})

export const Input = {
	Text,
}
