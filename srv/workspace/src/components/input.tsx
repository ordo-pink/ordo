// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// deno-lint-ignore-file no-explicit-any

import { Either, TEither } from "@ordo-pink/either"
import isEmail from "validator/es/lib/isEmail"
import { okpwd } from "@ordo-pink/okpwd"
import { ChangeEventHandler, KeyboardEventHandler, RefObject } from "react"

type InputProps = {
	value?: string
	onInput?: ChangeEventHandler<HTMLInputElement>
	onKeyDown?: KeyboardEventHandler<HTMLInputElement>
	id: string
	label: string
	name?: string
	type?: string
	placeholder?: string
	autocomplete?: string
	forwardRef?: RefObject<HTMLInputElement>
}

type EmailInputProps = Partial<InputProps> & {
	onChange?: (ev: TEither<string, string[]>) => any
}

type PasswordInputProps = Partial<InputProps> & {
	onChange?: (ev: TEither<string, string[]>) => any
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
	autocomplete = "off",
	forwardRef: ref,
}: InputProps) => (
	<div className="w-full flex flex-col">
		<label htmlFor="email" className="w-full text-sm font-medium leading-6 mb-2">
			{label}
		</label>
		<input
			ref={ref}
			id={id}
			name={name}
			type={type}
			autoComplete={autocomplete}
			value={value}
			onKeyDown={onKeyDown}
			onChange={onInput}
			placeholder={placeholder}
			className="w-full px-2 py-1 rounded-md border-0 shadow-inner placeholder:text-neutral-500 bg-neutral-50 dark:bg-neutral-700 focus:ring-0 sm:text-sm sm:leading-6"
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
