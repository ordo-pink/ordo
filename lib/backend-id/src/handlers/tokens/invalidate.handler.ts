import { default_handler } from "../default.handler"
import { get_token_from_authorization_header } from "../../common/get-auth-token-from-authorization-header"
import { remove_token } from "../../common/remove-token"
import { verify_auth_token } from "../../common/verify-auth-token"

// TODO
export const handle_invalidate = default_handler(intake =>
	get_token_from_authorization_header(intake)
		.and(verify_auth_token(intake))
		.and(remove_token(intake))
		.and(() => intake),
)
