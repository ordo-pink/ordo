import type { T as TAU } from "#lib/tau/mod.ts"
import { BehaviorSubject } from "#x/rxjs@v1.0.2/mod.ts"

// TODO: Reuse types
export type TokenInfo = {
	accessToken: string
	jti: string
	sub: string
}

const auth$ = new BehaviorSubject<TAU.Nullable<TokenInfo>>(null)

export const signIn = (info: TokenInfo) => {
	auth$.next(info)
}

export const signOut = () => {
	auth$.next(null)
}

export const isSignedIn = () => {
	return auth$.value !== null
}
