/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2024  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { current_user } from "@ordo-pink/_core"
import { Maoka } from "@ordo-pink/oss-maoka"
import { MaokaDOM } from "@ordo-pink/maoka-render-dom"
import { maoka_jabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { create_zags } from "@ordo-pink/oss-zags"

import "../../maoka-components.css"

const is_valid$ = create_zags({ value: true })

type TInputProps = {
	autocomplete?: string
	autofocus?: boolean
	custom_class?: string
	disabled?: boolean
	initial_value?: string
	label?: string
	on_blur?: (event: FocusEvent) => void
	on_focus?: (event: FocusEvent) => void
	on_input?: (event: Event) => void
	placeholder?: string
	required?: boolean
	transparent?: boolean
	type?: "text" | "email"
	validate?: (value: string) => boolean
	validation_error_message?: string
}
const Text = ({
	autocomplete,
	autofocus = false,
	custom_class = "",
	disabled,
	initial_value,
	label = "",
	on_blur,
	on_focus,
	on_input = () => void 0,
	placeholder,
	required = false,
	transparent,
	type = "text",
	validate = () => true,
	validation_error_message = "",
}: TInputProps) =>
	Maoka.create("label", ({ use }) => {
		use(maoka_jabs.set_class("input-wrapper"))
		use(maoka_jabs.listen("onclick", event => event.stopPropagation()))
		const id = crypto.randomUUID().replaceAll("-", "")

		return () => [
			Maoka.create("div", ({ use }) => {
				use(maoka_jabs.set_class("input_label"))

				return () => label
			}),

			Maoka.create("input", ({ element, use }) => {
				const is_mobile = use(maoka_jabs.is_mobile)
				const is_dom = use(MaokaDOM.Jabs.is_dom)

				if (disabled) use(maoka_jabs.set_attribute("disabled", "true"))

				use(
					maoka_jabs.listen("oninput", event => {
						const current_is_valid = is_valid$.select("value")

						if (!current_is_valid) is_valid$.update("value", () => true)

						return on_input(event)
					}),
				)

				use(
					maoka_jabs.listen("onchange", event => {
						const target = event.target as HTMLInputElement
						const is_valid = validate(target.value)
						const current_is_valid = is_valid$.select("value")

						if (is_valid !== current_is_valid) is_valid$.update("value", () => is_valid)
					}),
				)

				use(maoka_jabs.set_attribute("type", type))
				use(maoka_jabs.set_class("input_text", custom_class))

				if (!transparent) use(maoka_jabs.add_class("non-transparent"))
				if (autocomplete) use(maoka_jabs.set_attribute("autocomplete", autocomplete))
				if (initial_value) use(maoka_jabs.set_attribute("value", initial_value))
				if (placeholder) use(maoka_jabs.set_attribute("placeholder", placeholder))

				if (on_focus) use(maoka_jabs.listen("onfocus", on_focus))
				if (on_blur) use(maoka_jabs.listen("onblur", on_blur))

				use(
					MaokaDOM.Jabs.onmount(() => {
						if (is_dom && autofocus && !is_mobile && element instanceof HTMLInputElement) element.focus()
					}),
				)

				if (required) {
					use(maoka_jabs.set_attribute("required", "true"))
					use(maoka_jabs.set_attribute("aria-invalid", "true"))
					use(maoka_jabs.set_attribute("aria-errormessage", `error-info-${id}`))
				}
			}),

			Maoka.create("div", ({ use }) => {
				use(maoka_jabs.set_attribute("id", `error-info-${id}`))
				use(maoka_jabs.set_class("input_text-error"))

				const get_is_valid = use(MaokaOrdo.Jabs.happy_marriage$(is_valid$, s => s.value))

				return () => {
					const is_valid = get_is_valid()

					return is_valid ? void 0 : validation_error_message
				}
			}),
		]
	})

export const Email = ({
	autocomplete = "username",
	autofocus = false,
	custom_class = "",
	disabled = false,
	initial_value = "",
	label = "",
	on_input = () => void 0,
	placeholder,
	required = true,
	type = "email",
	validate = current_user.validations.is_email,
	validation_error_message = "WHOOPS",
}: TInputProps) =>
	Text({
		autocomplete,
		autofocus,
		custom_class,
		disabled,
		initial_value,
		label,
		on_input,
		placeholder,
		required,
		type,
		validate,
		validation_error_message,
	})

export const Input = {
	Email,
	Text,
}
