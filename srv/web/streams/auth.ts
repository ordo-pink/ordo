import type { TTau } from "#lib/tau/mod.ts"
import type { TBeID } from "#lib/be-id/mod.ts"

import { BehaviorSubject } from "#x/rxjs@v1.0.2/mod.ts"

const auth$ = new BehaviorSubject<TTau.Nullable<TBeID.AuthResponse>>(null)

export const signIn = (info: TBeID.AuthResponse) => {
	auth$.next(info)
}

export const signOut = () => {
	auth$.next(null)
}

export const isSignedIn = () => {
	return auth$.value !== null
}
