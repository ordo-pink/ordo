import { Maoka, maoka, maoka_dom, maoka_styled } from "@ordo-pink/maoka"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"

import { HotkeyOptions, hotkey } from "./hotkey.component"

import "./button.styles.css"

export type ButtonArgs = {
	on_click: (event: MouseEvent) => void | Promise<void>
	kindergarten: Maoka.Kindergarten
	hotkey?: string
	hotkey_options?: HotkeyOptions
	custom_class?: string
	aria_label?: string
}

export const success = (params: ButtonArgs) =>
	internal.default_button({ ...params, custom_class: internal.add_button_spec("success", params.custom_class) })
export const neutral = (params: ButtonArgs) =>
	internal.default_button({ ...params, custom_class: internal.add_button_spec("neutral", params.custom_class) })
export const primary = (params: ButtonArgs) =>
	internal.default_button({ ...params, custom_class: internal.add_button_spec("primary", params.custom_class) })

export const button = {
	neutral,
	success,
	primary,
}

namespace internal {
	const text_container = maoka_styled.div()

	export const default_button = maoka.create<ButtonArgs>(
		"button",
		({ kindergarten, on_click, aria_label = "", custom_class = "", hotkey: key, hotkey_options, use, node }) => {
			use(maoka_jabs.set_class("button", custom_class))
			use(maoka_jabs.set_attribute("aria-label", aria_label))
			use(maoka_jabs.listen("onclick", event => handle_click(event)))

			const handle_click = (event: MouseEvent) => {
				event.preventDefault()
				if (maoka_dom.guards.is_dom_node(node)) node.value.focus()
				return on_click(event)
			}

			return () => {
				return [text_container(() => kindergarten()), key ? hotkey({ ...hotkey_options, hotkey: key }) : void 0]
			}
		},
	)

	export const add_button_spec = (button_spec: string, custom_class?: string): string => {
		if (!custom_class) return button_spec

		return `${button_spec} ${custom_class}`
	}
}
