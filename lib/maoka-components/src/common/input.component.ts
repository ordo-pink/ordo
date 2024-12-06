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

import { BehaviorSubject } from "rxjs"

import { CurrentUser } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

const is_valid$ = new BehaviorSubject(true)

import "./input.css"

type TInputProps = {
	initial_value?: string
	on_input?: (event: Event) => void
	placeholder?: string
	type?: "text" | "email"
	label?: string
	custom_class?: string
	autofocus?: boolean
	autocomplete?: string
	required?: boolean
	validate?: (value: string) => boolean
	validation_error_message?: string
}
const Text = ({
	label = "",
	on_input = () => void 0,
	placeholder,
	type = "text",
	initial_value,
	custom_class = "",
	autofocus = false,
	autocomplete,
	required = false,
	validate = () => true,
	validation_error_message = "",
}: TInputProps) =>
	Maoka.create("label", ({ use }) => {
		use(MaokaJabs.set_class("w-full"))
		const id = crypto.randomUUID().replaceAll("-", "")

		return () => [
			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_class("input_label"))

				return () => label
			}),

			Maoka.create("input", ({ use, element, after_mount }) => {
				use(
					MaokaJabs.listen("oninput", event => {
						const current_is_valid = is_valid$.getValue()

						if (!current_is_valid) is_valid$.next(true)

						return on_input(event)
					}),
				)

				use(
					MaokaJabs.listen("onchange", event => {
						const target = event.target as HTMLInputElement
						const is_valid = validate(target.value)
						const current_is_valid = is_valid$.getValue()

						if (is_valid !== current_is_valid) is_valid$.next(is_valid)
					}),
				)

				use(MaokaJabs.set_attribute("type", type))
				use(MaokaJabs.set_class("input_text", custom_class))

				if (autocomplete) use(MaokaJabs.set_attribute("autocomplete", autocomplete))
				if (initial_value) use(MaokaJabs.set_attribute("value", initial_value))
				if (placeholder) use(MaokaJabs.set_attribute("placeholder", placeholder))
				if (autofocus) after_mount(() => element instanceof HTMLElement && element.focus())

				if (required) {
					use(MaokaJabs.set_attribute("required", "true"))
					use(MaokaJabs.set_attribute("aria-invalid", "true"))
					use(MaokaJabs.set_attribute("aria-errormessage", `error-info-${id}`))
				}
			}),

			Maoka.create("div", ({ use }) => {
				use(MaokaJabs.set_attribute("id", `error-info-${id}`))

				const get_is_valid = use(MaokaOrdo.Jabs.from$(is_valid$, true))

				return () => {
					const is_valid = get_is_valid()

					return is_valid ? void 0 : validation_error_message
				}
			}),
		]
	})

export const Email = ({
	label = "",
	on_input = () => void 0,
	placeholder,
	type = "email",
	initial_value = "",
	custom_class = "",
	autofocus = false,
	autocomplete = "username",
	validate = CurrentUser.Validations.is_email,
	required = true,
	validation_error_message = "WHOOPS",
}: TInputProps) =>
	Text({
		label,
		on_input,
		placeholder,
		type,
		initial_value,
		custom_class,
		autofocus,
		autocomplete,
		validate,
		required,
		validation_error_message,
	})

export const Input = {
	Email,
	Text,
}
