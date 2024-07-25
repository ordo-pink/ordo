import type { Observable } from "rxjs"

import type { Oath } from "@ordo-pink/oath"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { TCurrentUserRepository, TKnownUsersRepository } from "./user-repository.types"
import type { TRrr } from "./metadata.errors"

export type TGetCurrentUserFn = () => TResult<User.User, TRrr<"EAGAIN">>

export type TGetCurrentUserByIDFn = (
	id: User.User["id"],
) => Oath<TOption<User.User>, TRrr<"EAGAIN" | "EINVAL" | "EIO">>

export type TGetPublicUserByEmailFn = (
	email: User.User["email"],
) => Oath<TOption<User.PublicUser>, TRrr<"EAGAIN" | "EINVAL" | "EIO">>

export type TGetPublicUserByHandleFn = (
	handle: User.User["handle"],
) => Oath<TOption<User.PublicUser>, TRrr<"EAGAIN" | "EINVAL" | "EIO">>

export type TUserQuery = {
	get_current: TGetCurrentUserFn
	// get_current_by_id: TGetCurrentUserByIDFn
	get_by_email: TGetPublicUserByEmailFn
	// get_by_handle: TGetPublicUserByHandleFn
	get current_user_version$(): Observable<number>
}

export type TUserQueryStatic = {
	of: (
		current_user_repository: TCurrentUserRepository,
		known_user_repository: TKnownUsersRepository,
	) => TUserQuery
}
