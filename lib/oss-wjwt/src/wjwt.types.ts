/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type StandardPayload = { sub: Sub; aud?: Aud; iat?: Iat; jti?: Jti; iss?: Iss; exp?: Exp }
export type Payload<$Custom extends Record<string, unknown> = Record<string, unknown>> = StandardPayload & $Custom

export type Algorithm =
	| {
			name: "RSA-PSS"
			hash: {
				name: "SHA-256" | "SHA-384" | "SHA-512"
			}
			modulusLength: number
			publicExponent: Uint8Array
			saltLength: number
	  }
	| {
			name: "ECDSA"
			namedCurve: "P-256" | "P-384" | "P-512"
			hash: {
				name: "SHA-256" | "SHA-384" | "SHA-512"
			}
	  }

export type CreateArgs = [
	alg: Algorithm,
	private_key: CryptoKey,
	public_key: CryptoKey,
	aud: Aud,
	iss: Iss,
	token_lifetime_seconds: number,
]

export type Create<$Payload extends Payload = Payload> = (...args: CreateArgs) => Instance<$Payload>

export type Instance<$Payload extends Payload = Payload> = {
	sign: ReturnType<Sign<$Payload>>
	decode: Decode<$Payload>
	verify: ReturnType<Verify>
}

/**
 * JWT subject. User id is stored here.
 */
export type Sub = `${string}-${string}-${string}-${string}-${string}` & {}

/**
 * JWT audience.
 */
export type Aud = (string | string[]) & {}

/**
 * JWT issue time stamp.
 */
export type Iat = number & {}

/**
 * JWT id. This value is the same for refresh token and access token. This way access token can
 * be revoked even if its expiration time hasn't come yet.
 */
export type Jti = `${string}-${string}-${string}-${string}-${string}` & {}

/**
 * JWT issuer.
 */
export type Iss = string & {}

/**
 * JWT expiration time stamp.
 */
export type Exp = number & {}

export type Header = {
	typ: "JWT"
	alg: "ES256" | "ES384" | "ES512" | "ECDSA" | "RS256" | "RS384" | "RS512" | "RSA-PSS"
}

export type Signature = Uint8Array
export type TokenString = `${string}.${string}.${string}`

export type Token<$Payload extends Payload = Payload> = { header: Header; payload: $Payload; signature: Signature }

export type VerifyArgs = [key: CryptoKey, alg: Algorithm, aud: Aud]
export type Verify = (...args: VerifyArgs) => (token: TokenString) => Promise<boolean>

export type SignArgs = [key: CryptoKey, alg: Algorithm, iss: Iss, aud: Aud, token_lifetime: Exp]
export type SignResult<$Payload extends Payload = Payload> = [token: TokenString, payload: $Payload]
export type Sign<$Payload extends Payload = Payload> = (
	...args: SignArgs
) => (payload: $Payload) => Promise<SignResult<$Payload>>

export type Decode<$Payload extends Payload = Payload> = (token: TokenString) => Token<$Payload>
