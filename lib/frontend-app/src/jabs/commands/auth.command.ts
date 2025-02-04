import { BsBoxArrowInRight, BsBoxArrowRight } from "@ordo-pink/frontend-icons"
import { CheckboxInput, Dialog, Input } from "@ordo-pink/maoka-components"
import { CommandPaletteItemType, CurrentUser } from "@ordo-pink/core"
import { Maoka, TMaokaJab } from "@ordo-pink/maoka"
import { Oath, invokers0, ops0 } from "@ordo-pink/oath"
import { MaokaOrdo } from "@ordo-pink/maoka-ordo-jabs"
import { R } from "@ordo-pink/result"
import { ordo_app_state } from "@ordo-pink/frontend-app/app.state"

/**
 * Auth commands provide all the necessary tools for manipulating authentication, including signing in if
 * users are not authenticated, and signing out if they are.
 *
 * @command "cmd.auth.show_request_code_modal"
 * @command "cmd.auth.show_validate_code_modal"
 * @command_palette "Join"
 * @command_palette "Leave"
 * TODO @activity ["/join"]
 * TODO @activity ["/leave"]
 * TODO @activity ["/verify-code"]
 *
 * TODO Persist user info in browser
 * TODO Trigger merging remote and local user content after authentication (ContentManager)
 */
export const auth_commands: TMaokaJab = ({ onunmount, use }) => {
	let is_authenticated = false

	const commands = use(MaokaOrdo.Jabs.get_commands)
	const fetch = use(MaokaOrdo.Jabs.get_fetch)

	R.FromNullable(localStorage.getItem("user"))
		.pipe(R.ops.chain(str => R.Try(() => JSON.parse(str))))
		.pipe(R.ops.chain(user => R.If(CurrentUser.Validations.is_dto(user), { T: () => user as Ordo.User.Current.DTO })))
		.pipe(R.ops.chain(user => R.FromNullable(localStorage.getItem("token")).pipe(R.ops.map(token => ({ user, token })))))
		.pipe(R.ops.map(({ user, token }) => ({ user: CurrentUser.FromDTO(user), token })))
		.pipe(R.ops.map(auth => ordo_app_state.zags.update("auth", () => auth)))

	const handle_sign_out = () =>
		Oath.Resolve(new Headers())
			.and(headers =>
				Oath.FromNullable(localStorage.getItem("token"))
					.and(token => `Bearer ${token}`)
					.and(authorization_header => headers.append("Authorization", authorization_header))
					.and(() => headers),
			)
			.and(headers => ({ headers, method: "DELETE" }))
			.and(init => Oath.Try(() => fetch("http://localhost:3001/tokens/invalidate", init)))
			.invoke(invokers0.force_resolve)
			.then(clean_up_local_storage)
			.then(() => {
				const history_length = history.length
				history.go(-history_length)
				window.location.replace("/")
			})

	const handle_show_request_code: Ordo.Command.HandlerOf<"cmd.auth.show_request_code_modal"> = () =>
		commands.emit("cmd.application.modal.show", {
			render: () => RequestCodeModal,
		})

	const handle_show_validate_code: Ordo.Command.HandlerOf<"cmd.auth.show_validate_code_modal"> = email =>
		commands.emit("cmd.application.modal.show", {
			render: () => ValidateCodeModal(email),
		})

	commands.on("cmd.auth.show_request_code_modal", handle_show_request_code)
	commands.on("cmd.auth.show_validate_code_modal", handle_show_validate_code)
	commands.emit("cmd.application.command_palette.add", {
		readable_name: "t.auth.join",
		type: CommandPaletteItemType.MODAL_OPENER,
		value: handle_show_request_code,
		render_icon: BsBoxArrowInRight,
	})

	// TODO use other means but localStorage for storing user info
	const divorce_auth = ordo_app_state.zags.cheat("auth", (auth, is_update) => {
		if (is_update) {
			R.FromNullable(auth.user)
				.pipe(R.ops.chain(user => R.Try(() => JSON.stringify(user.to_dto()))))
				.pipe(R.ops.map(str => localStorage.setItem("user", str)))
				.pipe(R.ops.chain(() => R.FromNullable(auth.token)))
				.pipe(R.ops.map(str => localStorage.setItem("token", str)))
				.cata(R.catas.or_else(clean_up_local_storage))
		}

		if (auth.token) {
			if (!is_authenticated) {
				commands.off("cmd.auth.show_request_code_modal", handle_show_request_code)
				commands.off("cmd.auth.show_validate_code_modal", handle_show_validate_code)
				commands.emit("cmd.application.command_palette.remove", "t.auth.join")
				commands.emit("cmd.application.command_palette.add", {
					readable_name: "t.auth.leave",
					value: handle_sign_out,
					type: CommandPaletteItemType.DESTRUCTIVE_ACTION,
					render_icon: BsBoxArrowRight,
				})

				is_authenticated = true
			}
		} else {
			commands.on("cmd.auth.show_request_code_modal", handle_show_request_code)
			commands.on("cmd.auth.show_validate_code_modal", handle_show_validate_code)
			commands.emit("cmd.application.command_palette.remove", "t.auth.leave")
			commands.emit("cmd.application.command_palette.add", {
				readable_name: "t.auth.join",
				type: CommandPaletteItemType.MODAL_OPENER,
				value: handle_show_request_code,
				render_icon: BsBoxArrowInRight,
			})

			is_authenticated = false
		}
	})

	onunmount(() => {
		divorce_auth()

		commands.off("cmd.auth.show_request_code_modal", handle_show_request_code)
		commands.off("cmd.auth.show_validate_code_modal", handle_show_validate_code)
	})
}

const RequestCodeModal = Maoka.create("div", ({ use }) => {
	let email = ""
	let consent = false
	let is_valid = false

	const commands = use(MaokaOrdo.Jabs.get_commands)
	const fetch = use(MaokaOrdo.Jabs.get_fetch)

	// TODO Show hint
	// const t_hint = "We'll send you a magic link that will let you in." // TODO i18n
	const t_title = "Enter email" // TODO i18n
	const t_email_validation_error = "Put valid email" // TODO i18n
	const t_input_label = "Email" // TODO i18n
	const t_input_placeholder = "jacques@villeneuve.ca" // TODO i18n
	const t_next = "Next" // TODO i18n
	const t_checkbox_label =
		"I consent to the fact that you'll store stuff on my computer, and I don't mind as long as you don't share it." // TODO i18n

	const validate = CurrentUser.Validations.is_email

	const handle_input = (event: Event) => {
		const target = event.target as HTMLInputElement
		email = target.value
		is_valid = validate(email)
	}

	const handle_checkbox_change = () => {
		consent = !consent
	}

	return () =>
		// TODO render_icon
		Dialog({
			action: () =>
				Oath.If(is_valid && consent)
					.and(() => new Headers())
					.pipe(ops0.tap(headers => headers.append("content-type", "application/json")))
					.and(headers => ({ headers, method: "POST" }))
					.and(init => ({ ...init, body: JSON.stringify({ email }) }))
					// TODO Get input from env
					.and(init => Oath.FromPromise(() => fetch("http://localhost:3001/codes/request", init)))
					.and(res => res.json())
					.and(res => Oath.If(res.success))
					.and(() => commands.emit("cmd.auth.show_validate_code_modal", email as Ordo.User.Email))
					.invoke(invokers0.or_nothing),
			action_hotkey: "shift+enter",
			action_text: t_next,
			body: () => {
				const autofocus = true
				const placeholder = t_input_placeholder
				const initial_value = email
				const on_input = handle_input
				const validation_error_message = t_email_validation_error
				let label = t_input_label

				const input_params = { autofocus, label, placeholder, initial_value, on_input, validate, validation_error_message }

				const on_change = handle_checkbox_change
				label = t_checkbox_label

				const checkbox_params = { on_change, checked: consent, label }

				return [
					CodeModalInputWrapper(() => Input.Email(input_params)),
					RequestCodeModalCheckboxWrapper(() => CheckboxInput(checkbox_params)),
				]
			},
			title: t_title,
		})
})

const clean_up_local_storage = () => {
	localStorage.removeItem("user")
	localStorage.removeItem("token")
}

const RequestCodeModalCheckboxWrapper = Maoka.styled("div", { class: "px-8" })

const CodeModalInputWrapper = Maoka.styled("div", { class: "py-4" })

const ValidateCodeModal = (email: Ordo.User.Email) =>
	Maoka.create("div", ({ use }) => {
		let code = ""
		let is_valid = false

		const commands = use(MaokaOrdo.Jabs.get_commands)
		const fetch = use(MaokaOrdo.Jabs.get_fetch)

		const validate = (x: string) => /^\d{6}$/.test(x)

		const on_input = (event: Event) => {
			const target = event.target as HTMLInputElement
			code = target.value
			is_valid = validate(code)
		}

		const t_email_code_validation_error = "Put valid email code" // TODO i18n

		return () =>
			Dialog({
				action: () =>
					Oath.If(is_valid)
						.and(() => new Headers())
						.pipe(ops0.tap(headers => headers.append("content-type", "application/json")))
						.and(headers => ({ headers, method: "POST" }))
						.and(init => ({ ...init, body: JSON.stringify({ email, code }) }))
						// TODO Get input from env
						.and(init => Oath.FromPromise(() => fetch("http://localhost:3001/codes/validate", init)))
						.and(res => res.json())
						.and(res => Oath.If(res.success, { T: () => res.payload }))
						.and(({ token, user }) => ordo_app_state.zags.update("auth", () => ({ token, user: CurrentUser.FromDTO(user) })))
						.and(() => commands.emit("cmd.application.modal.hide"))
						.invoke(invokers0.or_nothing),
				action_text: "Join",
				title: "Enter code",
				action_hotkey: "enter",
				// TODO render_icon
				body: () => [
					CodeModalInputWrapper(() =>
						Input.Text({
							autofocus: true,
							label: "Email Code", // TODO i18n
							placeholder: "123456",
							initial_value: code,
							on_input,
							validate,
							validation_error_message: t_email_code_validation_error,
						}),
					),
				],
			})
	})
