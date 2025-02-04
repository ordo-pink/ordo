import { CurrentUser } from "@ordo-pink/core"

import { default_handler } from "../default.handler"
import { get_token_from_authorization_header } from "../../common/get-auth-token-from-authorization-header"
import { get_user_from_token } from "../../common/get-user-from-token"
import { verify_auth_token } from "../../common/verify-auth-token"

export const handle_validate_token = default_handler(intake =>
	get_token_from_authorization_header(intake)
		.and(verify_auth_token(intake))
		.and(get_user_from_token(intake))
		.and(CurrentUser.Serialize)
		.and(u => void (intake.payload = u))
		.and(() => intake),
)
