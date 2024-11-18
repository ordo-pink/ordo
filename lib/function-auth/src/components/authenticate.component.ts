// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { Button, Input } from "@ordo-pink/maoka-components"
import { CurrentUser } from "@ordo-pink/core"
import { Maoka } from "@ordo-pink/maoka"
import { MaokaJabs } from "@ordo-pink/maoka-jabs"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

import "./authenticate.component.css"

export default Maoka.create("div", ({ use }) => {
	use(MaokaJabs.add_class("auth"))

	const commands = use(MaokaOrdo.Jabs.Commands)

	commands.emit("cmd.application.set_title", "t.auth.pages.sign_in.label")

	return () => AuthentiateForm
})

const AuthentiateForm = Maoka.create("form", ({ use }) => {
	use(MaokaJabs.set_class("auth-form"))
	use(MaokaJabs.set_attribute("novalidate", "true"))
	use(MaokaJabs.listen("onsubmit", prevent_default))

	let email = ""
	let is_button_disabled = true

	const validate = CurrentUser.Validations.is_email
	const disabled = () => is_button_disabled
	const on_btn_click = () => console.log(email)

	const EnterBtn = Button.Primary({
		on_click: on_btn_click,
		text: "Enter",
		hotkey: "Enter",
		disabled,
	})

	const on_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		email = target.value
		is_button_disabled = !validate(target.value)

		void EnterBtn.refresh()
	}

	const t_hint = "We'll send you a magic link that will let you in." // TODO translations
	const t_email_validation_error = "Put valid email" // TODO translations

	return () => {
		const input_params = {
			autofocus: true,
			label: "Email",
			placeholder: "jacques@villeneuve.ca",
			initial_value: email,
			on_input,
			validate,
			validation_error_message: t_email_validation_error,
		}

		return [
			Title,
			StyledHint(() => t_hint),
			EmailFieldSet(() => Input.Email(input_params)),
			EnterBtn,
		]
	}
})

const prevent_default = (event: Event) => {
	event.preventDefault()
}

const Title = Maoka.create("h1", ({ use }) => {
	const t_title = "Enter your email"

	const width = 140 / (t_title.length ?? 1)

	use(MaokaJabs.set_class("auth_title"))
	use(MaokaJabs.set_style({ fontSize: `${width}vw` }))

	return () => [t_title, PleaseText(() => "please 🪓🩸")]
})

const EmailFieldSet = Maoka.styled("fieldset", { class: "auth-form_fieldset" })

const StyledHint = Maoka.styled("p", { class: "auth_hint" })

const PleaseText = Maoka.styled("p", { class: "auth_title_please" })
