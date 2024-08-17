import { type Observable } from "rxjs"

import { O, type TOption } from "@ordo-pink/option"
import { type AuthResponse } from "@ordo-pink/backend-server-id"
import { type TCreateFunctionContext } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { type TUserQuery } from "@ordo-pink/data"
import { extend } from "@ordo-pink/tau"
import { init_ordo_hooks } from "@ordo-pink/maoka-ordo-hooks"
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

	O.FromNullable(document.querySelector("#status-bar_account"))
		.pipe(O.ops.chain(root => (root instanceof HTMLDivElement ? O.Some(root) : O.None())))
		.pipe(O.ops.map(root => ({ root, component: StatusBarAuth })))
		.pipe(O.ops.map(extend(() => ({ hooks: { ...init_ordo_hooks(ctx) } }))))
		.pipe(O.ops.map(render_dom))
		.cata(O.catas.or_else(() => logger.error("#status-bar_account div not found.")))

	logger.debug("🟢 Initialised status bar auth.")
}
