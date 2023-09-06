// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Oath } from "@ordo-pink/oath"
import { RRR } from "./wjwt.constants"
import { UUIDv4 } from "@ordo-pink/tau"

export type R = Record<string, unknown>

export type TWJWT = (params: { alg: Algorithm; publicKey: CryptoKey; privateKey: CryptoKey }) => {
	sign0: ReturnType<WJWTSignFn>
	verify0: ReturnType<WJWTVerifyFn>
	decode0: WJWTDecodeFn
}

/**
 * JWT subject. User id is stored here.
 */
export type SUB = UUIDv4

/**
 * JWT audience.
 */
export type AUD = string[]

/**
 * JWT issue time stamp.
 */
export type IAT = number

/**
 * JWT id. This value is the same for refresh token and access token. This way access token can
 * be revoked even if its expiration time hasn't come yet.
 */
export type JTI = UUIDv4

/**
 * JWT issuer.
 */
export type ISS = string

/**
 * JWT expiration time stamp.
 */
export type EXP = number

export type Algorithm =
	| {
			name: "RSA-PSS"
			hash: "SHA-256" | "SHA-384" | "SHA-512"
			modulusLength: number
			publicExponent: Uint8Array
			saltLength: number
	  }
	| {
			name: "ECDSA"
			namedCurve: "P-256" | "P-384" | "P-512"
			hash: "SHA-256" | "SHA-384" | "SHA-512"
	  }

export type JWTPayload = {
	sub: SUB
	aud: AUD
	iat: IAT
	jti: JTI
	iss: ISS
	exp: EXP
}

export type JWTHeader = {
	typ: "JWT"
	alg: Algorithm
}

export type JWTSignature = Uint8Array

export type JWT<T extends R = R> = {
	header: JWTHeader
	payload: T & JWTPayload
	signature: JWTSignature
}

export type WJWTVerifyFn = (params: {
	key: CryptoKey
	alg: Algorithm
}) => (
	token: string,
	aud?: string,
) => Oath<boolean, RRR<"INVALID_TOKEN"> | RRR<"INVALID_KEY"> | RRR<"ALG_KEY_MISMATCH">>

export type WJWTSignFn = <T extends R = R>(params: {
	key: CryptoKey
	alg: Algorithm
}) => (payload: JWT<T>["payload"]) => Oath<string, RRR<"INVALID_PAYLOAD"> | RRR<"ALG_KEY_MISMATCH">>

export type WJWTDecodeFn = <T extends R = R>(
	token: string,
) => Oath<JWT<T>, RRR<"INVALID_TOKEN"> | RRR<"TOKEN_NOT_PROVIDED">>
