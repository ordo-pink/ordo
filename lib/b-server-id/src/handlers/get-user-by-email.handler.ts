import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"
import { server } from "@ordo-pink/sdk-server"

import type * as Lib from "../b-server-id.types"
import { server_core } from "@ordo-pink/b-server-core"

export const get_user_by_email: Lib.Handler = ({ env, params }) =>
	oath
		.from_nullable(params && params.email, to_missing_email_rrr)
		.pipe(oath.ops.chain(validate_email0))
		.pipe(oath.ops.chain(env.user_repository.get_by_email))
		.pipe(oath.ops.map(server.user.serialize_other))
		.pipe(oath.ops.chain(server_core.oaths.to_json))
		.pipe(oath.ops.map(core.fns.construct(Response)))
		.pipe(oath.ops.tap(set_content_type_header("application/json")))
		.cata(oath.catas.or_else(env.fail))

// --- Internal ---

const set_content_type_header = server_core.set_response_header("Content-Type")

const einval = curry(core.rrr.einval)

const to_missing_email_rrr = einval(CORE.RRR.REASON.EMAIL_MISSING)

const to_invalid_email_rrr = (e: string) => () => core.rrr.einval(CORE.RRR.REASON.EMAIL_INVALID, e)

const validate_email0 = (e: string) =>
	oath.if(core.user.email_guard(e), { on_false: to_invalid_email_rrr(e), on_true: () => e as Core.User.Email })
