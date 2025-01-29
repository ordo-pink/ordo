import { Oath } from "@ordo-pink/oath"

import { create_auth_token } from "../../common/create-auth-token"
import { default_handler } from "../default.handler"
import { get_token_from_authorization_header } from "../../common/get-auth-token-from-authorization-header"
import { get_user_from_token } from "../../common/get-user-from-token"
import { invalid_token_rrr } from "../../rrrs/invalid-token.rrr"
import { verify_auth_token } from "../../common/verify-auth-token"

export const handle_refresh = default_handler(intake =>
	get_token_from_authorization_header(intake)
		.and(token => verify_auth_token(intake)(token).and(v => Oath.If(v, { T: () => token, F: () => invalid_token_rrr(intake) })))
		.and(get_user_from_token(intake))
		// TODO Remove old token
		.and(create_auth_token(intake))
		// TODO Save token
		.and(({ token }) => void (intake.payload = token))
		.and(() => intake),
)
