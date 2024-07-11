import type { BehaviorSubject } from "rxjs"

import type { Oath } from "@ordo-pink/oath"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { TRrr } from "./metadata.errors"

export type TCurrentUserRepository = {
	get: () => TResult<User.User, TRrr<"EAGAIN">>
	put: (user: User.User) => TResult<void, TRrr<"EPERM" | "EINVAL">>
}

export type TCurrentUserRepositoryStatic = {
	of: (currentUser$: BehaviorSubject<TOption<User.User>>) => TCurrentUserRepository
}

export type TKnownUsersRepository = {
	get: () => Oath<User.PublicUser[], TRrr<"EAGAIN">>
	put: (users: User.PublicUser[]) => Oath<void, TRrr<"EINVAL">>
}

export type TKnownUserRepositoryStatic = {
	of: (knownUsers$: BehaviorSubject<TOption<User.PublicUser[]>>) => TKnownUsersRepository
}
