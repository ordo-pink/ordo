import { create_auth_token } from "../../common/create-auth-token"
import { default_handler } from "../default.handler"
import { get_token_from_authorization_header } from "../../common/get-auth-token-from-authorization-header"
import { get_user_from_token } from "../../common/get-user-from-token"
import { persist_token } from "../../common/persist-token"
import { remove_token } from "../../common/remove-token"
import { verify_persisted_auth_token } from "../../common/verify-auth-token"

export const handle_refresh = default_handler(intake =>
	get_token_from_authorization_header(intake)
		.and(verify_persisted_auth_token(intake))
		.and(remove_token(intake))
		.and(get_user_from_token(intake))
		.and(create_auth_token(intake))
		.and(persist_token(intake))
		.and(({ jwt }) => void (intake.payload = jwt.token))
		.and(() => intake),
)
