import { Oath } from "@ordo-pink/oath"
import { RRR } from "@ordo-pink/core"
import { type TIntake } from "@ordo-pink/routary"

import { type TSharedContext } from "../backend-id.types"
import { get_token_from_authorization_header } from "./get-auth-token-from-authorization-header"
import { get_user_from_token } from "./get-user-from-token"
import { invalid_token_rrr } from "../rrrs/invalid-token.rrr"
import { verify_auth_token } from "./verify-auth-token"

export const check_if_edited_user_is_current_user = (i: TIntake<TSharedContext>) =>
	get_token_from_authorization_header(i)
		.and(token => verify_auth_token(i)(token).and(v => Oath.If(v, { T: () => token, F: () => invalid_token_rrr(i) })))
		.and(get_user_from_token(i))
		.and(user =>
			Oath.If(user.id === i.params.user_id, { F: () => ({ rrr: RRR.codes.eperm("Cannot edit other user"), intake: i }) }),
		)
