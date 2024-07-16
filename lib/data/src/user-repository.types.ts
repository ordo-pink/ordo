import type { BehaviorSubject, Observable } from "rxjs"

import type { Oath } from "@ordo-pink/oath"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

import type { TRrr } from "./metadata.errors"
import { TFetch } from "@ordo-pink/core"

export type TCurrentUserRepository = {
	get: () => TResult<User.User, TRrr<"EAGAIN">>
	put: (user: User.User) => TResult<void, TRrr<"EPERM" | "EINVAL">>
	get version$(): Observable<number>
}

export type TCurrentUserRepositoryStatic = {
	of: (current_user$: BehaviorSubject<TOption<User.User>>) => TCurrentUserRepository
}

export type TAsyncCurrentUserRepository = {
	get: (token: string) => Oath<User.User, TRrr<"EIO" | "EPERM">>
	put: (token: string, user: User.User) => Oath<void, TRrr<"EINVAL" | "EIO" | "EPERM">>
}

export type TRemoteCurrentUserRepositoryStatic = {
	of: (id_host: string, fetch: TFetch) => TAsyncCurrentUserRepository
}

export type TKnownUsersRepository = {
	get: () => Oath<User.PublicUser[], TRrr<"EAGAIN">>
	put: (users: User.PublicUser[]) => Oath<void, TRrr<"EINVAL">>
	get version$(): Observable<number>
}

export type TKnownUserRepositoryStatic = {
	of: (known_user$: BehaviorSubject<User.PublicUser[]>) => TKnownUsersRepository
}
