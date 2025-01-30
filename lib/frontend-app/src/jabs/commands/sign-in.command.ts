import { CheckboxInput, Dialog, Input } from "@ordo-pink/maoka-components"
import { Maoka, TMaokaJab } from "@ordo-pink/maoka"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { CurrentUser } from "@ordo-pink/core"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"

export const auth_commands: TMaokaJab = ({ on_unmount, use }) => {
	const commands = use(MaokaOrdo.Jabs.get_commands)
	const state = use(MaokaOrdo.Context.consume)

	const handle_show_request_code_modal = () =>
		commands.emit("cmd.application.modal.show", {
			render: div => {
				const Component = MaokaOrdo.Components.WithState(state, () => RequestCodeModal)
				return Maoka.render_dom(div, Component)
			},
		})

	const handle_show_validate_code_modal = () =>
		commands.emit("cmd.application.modal.show", {
			render: div => {
				const Component = MaokaOrdo.Components.WithState(state, () => ValidateCodeModal)
				return Maoka.render_dom(div, Component)
			},
		})

	commands.on("cmd.auth.show_request_code_modal", handle_show_request_code_modal)
	commands.on("cmd.auth.show_validate_code_modal", handle_show_validate_code_modal)

	on_unmount(() => {
		commands.off("cmd.auth.show_request_code_modal", handle_show_request_code_modal)
		commands.off("cmd.auth.show_validate_code_modal", handle_show_validate_code_modal)
	})
}

const RequestCodeModal = Maoka.create("div", ({ use }) => {
	let email = ""
	let consent = false
	let is_valid = false

	const commands = use(MaokaOrdo.Jabs.get_commands)
	const fetch = use(MaokaOrdo.Jabs.get_fetch)

	// const t_hint = "We'll send you a magic link that will let you in." // TODO translations
	const t_email_validation_error = "Put valid email" // TODO translations

	const on_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		email = target.value
		is_valid = CurrentUser.Validations.is_email(email)
	}

	return () =>
		Dialog({
			action: () =>
				Oath.If(is_valid && consent)
					.and(() => new Headers())
					.pipe(ops0.tap(headers => headers.append("content-type", "application/json")))
					.and(headers =>
						// TODO Get from env
						Oath.FromPromise(() =>
							fetch("http://localhost:3001/codes/request", { method: "POST", body: JSON.stringify({ email }), headers }),
						),
					)
					.pipe(ops0.tap(console.log, console.error))
					.and(res => res.json())
					.and(() => commands.emit("cmd.auth.show_validate_code_modal"))
					.invoke(invokers0.or_nothing),
			// commands.emit("cmd.auth.show_validate_code_modal")
			action_hotkey: "enter",
			action_text: "Next",
			body: () => [
				InputWrapper(() =>
					Input.Email({
						autofocus: true,
						label: "Email", // TODO i18n
						placeholder: "jacques@villeneuve.ca",
						initial_value: email,
						on_input,
						validate: CurrentUser.Validations.is_email,
						validation_error_message: t_email_validation_error,
					}),
				),

				CheckboxWrapper(() =>
					CheckboxInput({
						on_change: () => void (consent = !consent),
						checked: consent,
						// TODO i18n
						label:
							"I consent to the fact that you'll store stuff on my computer, and I don't mind as long as you don't share it.",
					}),
				),
			],
			title: "Enter email", // TODO i18n
			// TODO render_icon
		})
})

const CheckboxWrapper = Maoka.styled("div", { class: "px-8" })

const InputWrapper = Maoka.styled("div", { class: "py-4" })

const ValidateCodeModal = Maoka.create("div", ({ use }) => {
	const commands = use(MaokaOrdo.Jabs.get_commands)

	return () =>
		Dialog({
			action: () => commands.emit("cmd.application.modal.hide"),
			action_text: "Join",
			title: "Enter code",
			action_hotkey: "enter",
			// TODO render_icon
			body: () => "World",
		})
})
