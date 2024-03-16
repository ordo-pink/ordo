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

import { ChangeEventHandler } from "react"

type InputProps = {
	value?: string
	onChange?: ChangeEventHandler<HTMLInputElement>
	id: string
	label: string
	name?: string
	type?: string
	placeholder?: string
	autocomplete?: string
}

type EmailInputProps = Partial<InputProps>

type PasswordInputProps = Partial<InputProps>

export const TextInput = ({
	value,
	id,
	label,
	onChange,
	placeholder = "",
	type = "text",
	name = "",
	autocomplete = "off",
}: InputProps) => (
	<div className="flex flex-col">
		<label htmlFor="email" className="mb-2 w-full text-sm font-medium leading-6">
			{label}
		</label>
		<input
			id={id}
			name={name}
			type={type}
			autoComplete={autocomplete}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className="w-full rounded-md border-0 bg-neutral-100 px-2 py-1 shadow-inner outline-none placeholder:text-neutral-500 sm:text-sm sm:leading-6 dark:bg-neutral-700"
		/>
	</div>
)

export const EmailInput = ({
	value,
	onChange,
	autocomplete = "email",
	id = "email",
	label = "Email",
	name = "email",
	placeholder = "hello@ordo.pink",
}: EmailInputProps) => {
	return (
		<TextInput
			value={value}
			id={id}
			label={label}
			autocomplete={autocomplete}
			name={name}
			placeholder={placeholder}
			type="email"
			onChange={onChange}
		/>
	)
}

export const PasswordInput = ({
	value,
	onChange,
	autocomplete = "password",
	id = "password",
	label = "Password",
	name = "password",
	placeholder = "********",
}: PasswordInputProps) => {
	return (
		<TextInput
			value={value}
			id={id}
			onChange={onChange}
			label={label}
			autocomplete={autocomplete}
			name={name}
			placeholder={placeholder}
			type="password"
		/>
	)
}
