import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { oath } from "@ordo-pink/oss-oath"
import { server } from "@ordo-pink/sdk-server"
import { server_core } from "@ordo-pink/b-server-core"

import type * as Lib from "../b-server-id.types"
import { check_is_executing_on_self, check_user_is_authenticated, extract_id_param } from "../common"

export const get_user_by_id: Lib.Handler = ({ env, params, request }) =>
	check_user_is_authenticated(request, env)
		.pipe(oath.ops.chain(extract_id_param(params)))
		.pipe(oath.ops.chain(validate_id))
		.pipe(oath.ops.chain(check_is_executing_on_self(request)))
		.pipe(oath.ops.chain(env.user_repository.read))
		.pipe(oath.ops.map(server.user.serialize))
		.pipe(oath.ops.chain(server_core.oaths.to_json))
		.pipe(oath.ops.map(core.fns.construct(Response)))
		.pipe(oath.ops.tap(server_core.set_response_header("Content-Type", "application/json")))
		.cata(oath.catas.or_else(env.fail))

// --- Internal ---

const to_invalid_id_rrr = (e: string) => () => core.rrr.einval(CORE.RRR.REASON.USER_ID_INVALID, e)
const validate_id = (e: string) =>
	oath.if(core.uuid.guard(e), { on_false: to_invalid_id_rrr(e), on_true: () => e as Core.User.Id })
