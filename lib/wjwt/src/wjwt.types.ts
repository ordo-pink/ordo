/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { UUIDv4 } from "@ordo-pink/tau"

export type TCustomPayload = Record<string, unknown>

export type TAlgorithm =
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

export type TWJWTFn<$TPayload extends TCustomPayload = TCustomPayload> = (params: {
	alg: TAlgorithm
	public_key: CryptoKey
	private_key: CryptoKey
	aud: AUD
	iss: ISS
}) => TWJWT<$TPayload>

export type TWJWT<$TPayload extends TCustomPayload = TCustomPayload> = {
	sign: ReturnType<TWJWTSignFn<$TPayload>>
	decode: TWJWTDecodeFn<$TPayload>
	verify: ReturnType<TWJWTVerifyFn>
}

/**
 * JWT subject. User id is stored here.
 */
export type SUB = UUIDv4

/**
 * JWT audience.
 */
export type AUD = string | string[]

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

export type TStandardJWTPayload = {
	sub: SUB
	aud: AUD
	iat: IAT
	jti: JTI
	iss: ISS
	exp: EXP
}

export type TJWTHeader = {
	typ: "JWT"
	alg: "ES256" | "ES384" | "ES512" | "ECDSA" | "RS256" | "RS384" | "RS512" | "RSA-PSS"
}

export type TJWTSignature = Uint8Array

export type TJWT<$TPayload extends TCustomPayload = TCustomPayload> = {
	header: TJWTHeader
	payload: $TPayload & TStandardJWTPayload
	signature: TJWTSignature
}

export type TWJWTVerifyFn = (params: { key: CryptoKey; alg: TAlgorithm; aud: AUD }) => (token: string) => Promise<boolean>

export type TWJWTSignFn<$TPayload extends TCustomPayload = TCustomPayload> = (params: {
	key: CryptoKey
	alg: TAlgorithm
	iss: ISS
	token_lifetime: EXP
}) => (payload: Partial<TJWT<$TPayload>["payload"]> & { aud: AUD; sub: SUB }) => Promise<string>

export type TWJWTDecodeFn<T extends TCustomPayload = TCustomPayload> = (token: string) => TJWT<T>
