import { useSignal } from "@preact/signals"
import { JSX } from "preact"
import { Either, TEither } from "#lib/either/mod.ts"
import { isEmail } from "#x/deno_validator@v0.0.5/mod.ts"
import { okpwd } from "#lib/okpwd/mod.ts"

type InputProps = {
	value?: string
	onInput?: JSX.EventHandler<JSX.TargetedEvent<HTMLInputElement>>
	id: string
	label: string
	name?: string
	type?: string
	placeholder?: string
	autocomplete?: string
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
	id,
	label,
	placeholder = "",
	type = "text",
	name = "",
	autocomplete = "off",
}: InputProps) => (
	<div class="flex flex-col">
		<label
			for="email"
			class="w-full text-sm font-medium leading-6 mb-2"
		>
			{label}
		</label>
		<input
			id={id}
			name={name}
			type={type}
			autocomplete={autocomplete}
			value={value}
			onInput={onInput}
			placeholder={placeholder}
			class="w-full px-2 py-1 rounded-md border-0 shadow-inner placeholder:text-neutral-500 bg-neutral-200 dark:bg-neutral-700 outline-none sm:text-sm sm:leading-6"
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
	const error = useSignal("")

	return (
		<TextInput
			value={value}
			id={id}
			onInput={e => {
				if (onInput) onInput(e)

				if (onChange) {
					const value = e.currentTarget.value

					if (!value) return onChange(Either.right(""))

					const errors = Either.fromBooleanLazy(
						() => isEmail(value, {}),
						() => value,
						() => ["Invalid email."]
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
