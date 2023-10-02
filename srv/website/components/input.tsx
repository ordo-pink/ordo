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

type EmailInputProps = Partial<InputProps> & {
	onInput?: (ev: Oath<string, string[]>) => any
}

type PasswordInputProps = Partial<InputProps> & {
	onInput?: (ev: Oath<string, string[]>) => any
}

export const TextInput = ({
	value,
	onChange = () => void 0,
	id,
	label,
	placeholder = "",
	type = "text",
	name = "",
	autocomplete = "off",
}: InputProps) => (
	<div className="flex flex-col">
		<label htmlFor="email" className="w-full text-sm font-medium leading-6 mb-2">
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
			className="w-full px-2 py-1 rounded-md border-0 shadow-inner placeholder:text-neutral-500 bg-neutral-200 dark:bg-neutral-700 outline-none sm:text-sm sm:leading-6"
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
			onChange={event => {
				if (onChange) onChange(event)

				if (onInput) {
					if (!event.target.value) return onInput(Oath.resolve(""))

					onInput(
						Oath.of(event.target.value)
							.chain(v => new Oath<string>(resolve => setTimeout(() => resolve(v), 1000)))
							.chain(v =>
								Oath.fromBoolean(
									() => validator.isEmail(v),
									() => v,
									() => ["Invalid email"],
								),
							),
					)
				}
			}}
		/>
	)
}

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
			onChange={event => {
				if (onChange) onChange(event)

				if (onInput) {
					if (!event.target.value) return onInput(Oath.resolve(""))

					onInput(
						Oath.of(event.target.value)
							.chain(v => new Oath<string>(resolve => setTimeout(() => resolve(v), 1000)))
							.map(validatePassword)
							.chain(error =>
								Oath.fromBoolean(
									() => !error,
									() => event.target.value,
									() => [error as string],
								),
							),
					)
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
