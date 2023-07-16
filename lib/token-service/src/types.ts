import { Algorithm } from "#x/djwt@v2.9.1/algorithm.ts"
import { Nullable } from "#lib/tau/mod.ts"

export type TokenMap = Record<string, Nullable<string>>

export type TokenDriver = {
	get(id: string): Promise<Nullable<TokenMap>>
	set(id: string, value: TokenMap): Promise<Nullable<TokenMap>>
	setToken(
		id: string,
		ip: string,
		refreshToken: Nullable<string>
	): Promise<Nullable<TokenMap>>
	// remove(id: string): Promise<Nullable<TokenMap>>
}

export type TokenServiceOptions = {
	publicKey: CryptoKey
	privateKey: CryptoKey
	alg: Algorithm
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
}
