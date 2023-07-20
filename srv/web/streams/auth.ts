import { BehaviorSubject } from "#x/rxjs@v1.0.2/mod.ts"
import { Nullable } from "#lib/tau/mod.ts"

export type TokenPair = {
	accessToken: string
	refreshToken: string
}

const auth$ = new BehaviorSubject<Nullable<TokenPair>>(null)

export const signIn = (pair: TokenPair) => {
	auth$.next(pair)
}

export const signOut = (pair: TokenPair) => {
	auth$.next(null)
}

export const isSignedIn = () => {
	return auth$.value !== null
}
