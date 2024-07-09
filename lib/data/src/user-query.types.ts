import type { Oath } from "@ordo-pink/oath"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { TRrr } from "./metadata.errors"

export type TGetCurrentUserFn = () => TResult<User.User, TRrr<"EAGAIN">>

export type TGetPublicUserByIDFn = (
	id: User.User["id"],
) => Oath<TOption<User.PublicUser>, TRrr<"EINVAL" | "EIO">>

export type TGetPublicUserByEmailFn = (
	email: User.User["email"],
) => Oath<TOption<User.PublicUser>, TRrr<"EINVAL" | "EIO">>

export type TUserRepository = {
	get: () => void
	put: () => void
}

export type TUserQuery = {
	getCurrentUser: TGetCurrentUserFn
	getPublicUserByID: TGetPublicUserByIDFn
	getPublicUserByEmail: TGetPublicUserByEmailFn
	// TODO: getPublicUserByHandle: (email: User.User["email"]) => Oath<TOption<User.PublicUser>, TRrr<"EINVAL" | "EIO">>
}

export type TUserQueryStatic = {
	of: (userRepository: TUserRepository) => TUserQuery
}
