import { type JTI } from "@ordo-pink/wjwt"
import { Oath } from "@ordo-pink/oath"
import { type TRrr } from "@ordo-pink/data"
import { type TTokenService } from "@ordo-pink/backend-service-token"

export type TCreateAuthTokenResult = {
	user: User.InternalUser
	expires: Date
	jti: JTI
	token: string
}

export const create_auth_token0 =
	(token_service: TTokenService) =>
	(user: User.InternalUser): Oath<TCreateAuthTokenResult, TRrr<"EIO" | "EINVAL" | "ENOENT">> =>
		token_service
			.create({
				sub: user.id,
				data: {
					lim: user.file_limit,
					mfs: user.max_upload_size,
					sbs: user.subscription,
					mxf: user.max_functions,
				},
			})
			.pipe(
				Oath.ops.chain(({ exp, jti, token }) =>
					Oath.Resolve(new Date(Date.now() + exp)).pipe(
						Oath.ops.map(expires => ({ user, expires, jti, token })),
					),
				),
			)
