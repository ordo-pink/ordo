/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"

import { WJWT } from "./wjwt"

const payload = {
	aud: "asdf",
	exp: Date.now() / 1000 + 600,
	iat: Date.now(),
	iss: "asdf",
	jti: crypto.randomUUID(),
	sub: crypto.randomUUID(),
}
const get_ecdsa_wjwt = async () => {
	const { privateKey: private_key, publicKey: public_key } = await crypto.subtle.generateKey(
		{ name: "ECDSA", namedCurve: "P-256" },
		true,
		["sign", "verify"],
	)

	return WJWT({ alg: { name: "ECDSA", hash: { name: "SHA-256" }, namedCurve: "P-256" }, private_key, public_key, aud: "asdf" })
}

const get_rse_wjwt = async () => {
	const { privateKey: private_key, publicKey: public_key } = await crypto.subtle.generateKey(
		{
			name: "RSA-PSS",
			hash: { name: "SHA-256" },
			modulusLength: 4096,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
		},
		false,
		["sign", "verify"],
	)

	return WJWT({
		alg: {
			name: "RSA-PSS",
			hash: { name: "SHA-256" },
			modulusLength: 4096,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
			saltLength: 32,
		},
		private_key,
		public_key,
		aud: "asdf",
	})
}

test("wjwt should sign given payload with ECDSA", async () => {
	const wjwt = await get_ecdsa_wjwt()
	const signed = await wjwt.sign(payload)

	expect(signed).toBeTypeOf("string")
})

test("wjwt should verify given token with ECDSA", async () => {
	const wjwt = await get_ecdsa_wjwt()
	const signed = await wjwt.sign(payload)
	const verified = await wjwt.verify(signed)

	expect(verified).toBeTrue()
})

test("wjwt should sign given payload with RSA", async () => {
	const wjwt = await get_rse_wjwt()
	const signed = await wjwt.sign(payload)

	expect(signed).toBeTypeOf("string")
})

test("wjwt should verify given token with RSA", async () => {
	const wjwt = await get_rse_wjwt()
	const signed = await wjwt.sign(payload)
	const verified = await wjwt.verify(signed)

	expect(verified).toBeTrue()
})

test("wjwt should decode given token", async () => {
	const wjwt = await get_ecdsa_wjwt()
	const signed = await wjwt.sign(payload)
	const decoded = wjwt.decode(signed)

	expect(decoded && decoded.payload).toEqual(payload)
})
