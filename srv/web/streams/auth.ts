import type { Nullable } from "#lib/tau/mod.ts"
import type { AuthResponse } from "#lib/backend-id-server/mod.ts"

import { BehaviorSubject } from "#x/rxjs@v1.0.2/mod.ts"

const auth$ = new BehaviorSubject<Nullable<AuthResponse>>(null)

export const signIn = (info: AuthResponse) => {
	auth$.next(info)
}

export const signOut = () => {
	auth$.next(null)
}

export const isSignedIn = () => {
	return auth$.value !== null
}
