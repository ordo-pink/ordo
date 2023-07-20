import { Algorithm } from "#x/djwt@v2.9.1/algorithm.ts"
import { Nullable } from "#lib/tau/mod.ts"
import { TEither } from "#lib/either/mod.ts"

export type TokenMap = Record<JTI, string>

export type CryptoKeyPair = {
	private: CryptoKey
	public: CryptoKey
}
export type IDKeyChain = {
	access: CryptoKeyPair
	refresh: CryptoKeyPair
}

export type TokenHeader = {
	alg: Algorithm
	type: "JWT"
}

export type SUB = string
export type UIP = string
export type AUD = string
export type IAT = number
export type JTI = string
export type ISS = string
export type EXP = number

export type AccessTokenPayload = {
	readonly sub: SUB
	readonly aud: AUD
	readonly iat: IAT
	readonly jti: JTI
	readonly iss: ISS
	readonly exp: EXP
}

export type RefreshTokenPayload = AccessTokenPayload & {
	readonly uip: UIP
}

export type AccessTokenParsed = {
	readonly header: TokenHeader
	readonly payload: AccessTokenPayload
	readonly signature: Uint8Array
}

export type RefreshTokenParsed = {
	header: TokenHeader
	payload: RefreshTokenPayload
	signature: Uint8Array
}

export type TokenAdapter = {
	get(sub: SUB, jti: JTI): Promise<TEither<string, string>>
	getAll(sub: SUB): Promise<TEither<TokenMap, string>>
	remove(sub: SUB, jti: JTI): Promise<TEither<"OK", string>>
	removeAll(sub: SUB): Promise<TEither<"OK", string>>
	set(sub: SUB, jti: JTI, token: string): Promise<TEither<"OK", string>>
	setAll(sub: SUB, map: TokenMap): Promise<TEither<"OK", string>>
}

export type TokenServiceOptions = {
	keys: IDKeyChain
	alg: Algorithm
	accessTokenExpireIn: number
	refreshTokenExpireIn: number
}
