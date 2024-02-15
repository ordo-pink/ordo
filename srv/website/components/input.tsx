// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import validator from "validator"
import { Oath } from "@ordo-pink/oath"
import { okpwd } from "@ordo-pink/okpwd"
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
			className="px-2 py-1 w-full rounded-md border-0 shadow-inner outline-none bg-neutral-100 placeholder:text-neutral-500 sm:text-sm sm:leading-6 dark:bg-neutral-700"
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
