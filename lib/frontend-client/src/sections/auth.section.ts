import { BsAward, BsBoxArrowInDown, BsGear, BsPersonCircle } from "react-icons/bs"
import { type Observable } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { type TUserQuery } from "@ordo-pink/data"
import { render_dom } from "@ordo-pink/maoka"

import { StatusBarAuth } from "../components/status-bar-auth/status-bar-auth.component"

type P = {
	logger: TLogger
	commands: Client.Commands.Commands
	user_query: TUserQuery
	auth$: Observable<TOption<AuthResponse>>
	ctx: TCreateFunctionContext
}
export const init_auth_section = ({ logger, ctx }: P) => {
	logger.debug("🟡 Initialising status bar auth...")

	const commands = ctx.get_commands()

	commands.emit("cmd.application.context_menu.add", {
		readable_name: "Open user page", // TODO: Translations
		Icon: BsPersonCircle,
		should_show: ({ payload }) => payload === "status-bar-user",
		type: "read",
		cmd: "cmd.user.open_current_user_profile",
	})

	commands.emit("cmd.application.context_menu.add", {
		readable_name: "Open settings", // TODO: Translations
		Icon: BsGear,
		should_show: ({ payload }) => payload === "status-bar-user",
		type: "update",
		cmd: "cmd.user.open_settings",
	})

	commands.emit("cmd.application.context_menu.add", {
		readable_name: "Open achievements", // TODO: Translations
		Icon: BsAward,
		should_show: ({ payload }) => payload === "status-bar-user",
		type: "read",
		cmd: "cmd.user.open_achievements",
	})

	commands.emit("cmd.application.context_menu.add", {
		readable_name: "Sign out", // TODO: Translations
		Icon: BsBoxArrowInDown,
		should_show: ({ payload }) => payload === "status-bar-user",
		type: "delete",
		cmd: "cmd.auth.sign_out",
	})

	O.FromNullable(document.querySelector("#status-bar_account"))
		.pipe(O.ops.chain(root => (root instanceof HTMLDivElement ? O.Some(root) : O.None())))
		.pipe(O.ops.map(root => ({ root, component: StatusBarAuth(ctx) })))
		.pipe(O.ops.map(({ root, component }) => render_dom(root, component)))
		.cata(O.catas.or_else(() => logger.error("#status-bar_account div not found.")))

	logger.debug("🟢 Initialised status bar auth.")
}
