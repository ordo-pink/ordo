import type { Observable } from "rxjs"

import type { TFetch, THosts, TKnownFunctions, TPermissions, TRequireFID } from "@ordo-pink/core"
import type { TRrr, TUserQuery } from "@ordo-pink/data"
import type { AuthResponse } from "@ordo-pink/backend-server-id"
import type { TLogger } from "@ordo-pink/logger"
import type { TOption } from "@ordo-pink/option"
import type { TResult } from "@ordo-pink/result"

export type TKnownFunction = {
	name: string
	fid: symbol
	permissions: TPermissions
}

export type TInitCtx = {
	commands: Client.Commands.Commands
	logger: TLogger
	known_functions: TKnownFunctions
	APP_FID: symbol
	is_dev: boolean
	hosts: THosts
	activities$: Observable<Functions.Activity[]>
	current_activity$: Observable<TOption<Functions.Activity>>
	set_current_activity: TRequireFID<(name: string) => TResult<void, TRrr<"EPERM" | "ENOENT">>>
	fetch: TFetch
	auth$: Observable<TOption<AuthResponse>>
	user_query: TUserQuery
}
