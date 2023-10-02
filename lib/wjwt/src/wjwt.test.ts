// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { test, expect } from "bun:test"
import { WJWT } from "./wjwt"
import { SUB } from "./wjwt.types"

const payload = {
	aud: ["asdf"],
	exp: Date.now() / 1000 + 600,
	iat: Date.now(),
	iss: "asdf",
	jti: crypto.randomUUID() as SUB,
	sub: crypto.randomUUID() as SUB,
}
const getEcdsaWjwt = async () => {
	const { privateKey, publicKey } = (await crypto.subtle.generateKey(
		{ name: "ECDSA", namedCurve: "P-256" },
		true,
		["sign", "verify"],
	)) as CryptoKeyPair

	return WJWT({ alg: { name: "ECDSA", hash: "SHA-256" } as any, privateKey, publicKey })
}

const getRsaWjwt = async () => {
	const { privateKey, publicKey } = (await crypto.subtle.generateKey(
		{
			name: "RSA-PSS",
			hash: "SHA-256",
			modulusLength: 4096,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
		} as any,
		false,
		["sign", "verify"],
	)) as CryptoKeyPair

	return WJWT({
		alg: {
			name: "RSA-PSS",
			hash: "SHA-256",
			modulusLength: 4096,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			saltLength: 32,
		} as any,
		privateKey,
		publicKey,
	})
}

test("wjwt should sign given payload with ECDSA", async () => {
	const wjwt = await getEcdsaWjwt()
	const signed = await wjwt.sign0(payload).orElse(() => null)

	expect(signed).toBeTypeOf("string")
})

test("wjwt should verify given token with ECDSA", async () => {
	const wjwt = await getEcdsaWjwt()
	const signed = await wjwt.sign0(payload).orElse(() => "")
	const verified = await wjwt.verify0(signed).fork(
		l => l,
		r => r,
	)

	expect(verified).toBeTrue()
})

test("wjwt should sign given payload with RSA", async () => {
	const wjwt = await getRsaWjwt()
	const signed = await wjwt.sign0(payload).orElse(() => null)

	expect(signed).toBeTypeOf("string")
})

test("wjwt should verify given token with RSA", async () => {
	const wjwt = await getRsaWjwt()
	const signed = await wjwt.sign0(payload).orElse(() => "")
	const verified = await wjwt.verify0(signed).fork(
		l => l,
		r => r,
	)

	expect(verified).toBeTrue()
})

test("wjwt should decode given token", async () => {
	const wjwt = await getEcdsaWjwt()
	const signed = await wjwt.sign0(payload).orElse(() => "")
	const decoded = await wjwt.decode0(signed).fork(
		l => l,
		r => r,
	)

	expect(decoded.payload).toEqual(payload)
})
