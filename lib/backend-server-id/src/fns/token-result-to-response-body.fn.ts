import { type TCreateAuthTokenResult } from "./create-auth-token.fn"

export const token_result_to_response_body = ({
	user: { file_limit, max_functions, max_upload_size, id: sub, subscription },
	expires,
	jti,
	token,
}: TCreateAuthTokenResult) => ({
	expires,
	file_limit,
	jti,
	max_functions,
	max_upload_size,
	sub,
	subscription,
	token,
})
