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

// deno-lint-ignore-file no-explicit-any

import { ChangeEventHandler, KeyboardEventHandler, RefObject } from "react"
import isEmail from "validator/es/lib/isEmail"

import { Either, TEither } from "@ordo-pink/either"
import { okpwd } from "@ordo-pink/okpwd"

type InputProps = {
	value?: string
	onInput?: ChangeEventHandler<HTMLInputElement>
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>
	id: string
	label: string
	name?: string
	autoFocus?: boolean
	type?: string
	placeholder?: string
	autocomplete?: string
	forwardRef?: RefObject<HTMLInputElement>
}

type EmailInputProps = Partial<InputProps> & {
	onChange?: (ev: TEither<string, string[]>) => void
}

type PasswordInputProps = Partial<InputProps> & {
	onChange?: (ev: TEither<string, string[]>) => void
}

export const TextInput = ({
	value,
	onInput = () => void 0,
	onKeyDown = () => void 0,
	id,
	label,
	placeholder = "",
	type = "text",
	name = "",
	autoFocus,
	autocomplete = "off",
	forwardRef: ref,
}: InputProps) => (
	<div className="flex w-full flex-col">
		<label htmlFor="email" className="mb-2 w-full text-sm font-medium leading-6">
			{label}
		</label>
		<input
			ref={ref}
			id={id}
			autoFocus={autoFocus}
			name={name}
			type={type}
			autoComplete={autocomplete}
			value={value}
			onKeyDown={onKeyDown}
			onChange={onInput}
			placeholder={placeholder}
			className="w-full rounded-md border-0 bg-neutral-50 px-2 py-1 shadow-inner placeholder:text-neutral-500 focus:ring-0 sm:text-sm sm:leading-6 dark:bg-neutral-600"
		/>
	</div>
)

export const EmailInput = ({
	value,
	onInput,
	onChange,
	autocomplete = "email",
	id = "email",
	label = "Email",
	name = "email",
	placeholder = "hello@ordo.pink",
}: EmailInputProps) => (
	<TextInput
		value={value}
		id={id}
		onInput={e => {
			if (onInput) onInput(e)

			if (onChange) {
				const value = e.currentTarget.value

				if (!value) return onChange(Either.right(""))

				const errors = Either.fromBoolean(
					() => isEmail(value),
					() => value,
					() => ["Invalid email."],
				)

				onChange(errors)
			}
		}}
		label={label}
		autocomplete={autocomplete}
		name={name}
		placeholder={placeholder}
		type="email"
	/>
)

export const PasswordInput = ({
	value,
	onInput,
	onChange,
	autocomplete = "password",
	id = "password",
	label = "Password",
	name = "password",
	placeholder = "********",
}: PasswordInputProps) => {
	const validatePassword = okpwd()

	return (
		<TextInput
			value={value}
			id={id}
			onInput={e => {
				if (onInput) onInput(e)

				if (onChange) {
					const value = e.currentTarget.value
					const errors = validatePassword(value)

					onChange(errors ? Either.left([errors]) : Either.right(value))
				}
			}}
			label={label}
			autocomplete={autocomplete}
			name={name}
			placeholder={placeholder}
			type="password"
		/>
	)
}
