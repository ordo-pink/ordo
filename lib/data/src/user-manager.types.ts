import type { Observable } from "rxjs"

import type { AuthResponse } from "@ordo-pink/backend-server-id"
import type { TOption } from "@ordo-pink/option"

import type { TAsyncCurrentUserRepository, TCurrentUserRepository } from "./user-repository.types"

export type TCurrentUserManagerStatic = {
	of: (
		memory_repository: TCurrentUserRepository,
		remote_repository: TAsyncCurrentUserRepository,
		auth$: Observable<TOption<AuthResponse>>,
	) => TUserManager
}

export type TUserManagerStateChange =
	| "get-remote"
	| "get-remote-complete"
	| "put-remote"
	| "put-remote-complete"

export type TUserManager = {
	start: (on_state_change: (change: TUserManagerStateChange) => void) => void
}
