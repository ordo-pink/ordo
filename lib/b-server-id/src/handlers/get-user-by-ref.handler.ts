import { CORE, type Core, core } from "@ordo-pink/sdk-core"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"
import { server } from "@ordo-pink/sdk-server"

import type * as Lib from "../b-server-id.types"
import { server_core } from "@ordo-pink/b-server-core"

export const get_user_by_ref: Lib.Handler = ({ env, params }) =>
	oath
		.from_nullable(params && params.ref, to_missing_ref_rrr)
		.pipe(oath.ops.chain(validate_ref0))
		.pipe(oath.ops.chain(env.user_repository.get_by_ref))
		.pipe(oath.ops.map(server.user.serialize_other))
		.pipe(oath.ops.chain(server_core.oaths.to_json))
		.pipe(oath.ops.map(create_response))
		.pipe(oath.ops.tap(set_content_type_json))
		.cata(oath.catas.or_else(env.fail))

// --- Internal ---

const create_response = core.fns.construct(Response)

const set_content_type_json = server_core.set_response_header("Content-Type", "application/json")

const einval = curry(core.rrr.einval)
const to_missing_ref_rrr = einval(CORE.RRR.REASON.REF_MISSING)

const to_invalid_ref_rrr = (e: string) => () => core.rrr.einval(CORE.RRR.REASON.REF_INVALID, e)

const validate_ref0 = (e: string) =>
	oath.if(core.user.ref_guard(e), {
		on_false: to_invalid_ref_rrr(e),
		on_true: () => e as Core.User.Ref,
	})
