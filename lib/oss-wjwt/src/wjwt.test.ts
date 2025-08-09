/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"

import { create } from "./wjwt.impl"

const iss = "issuer inc."

const publicExponent = new Uint8Array([0x01, 0x00, 0x01])

const payload = {
	aud: "asdf",
	exp: Math.floor(Date.now() / 1000 + 600),
	iat: Date.now(),
	iss,
	jti: crypto.randomUUID(),
	sub: crypto.randomUUID(),
}
const get_ecdsa_wjwt = async () => {
	const alg = { name: "ECDSA", hash: { name: "SHA-256" }, namedCurve: "P-256" } as const
	const { privateKey: private_key, publicKey: public_key } = await crypto.subtle.generateKey(alg, true, ["sign", "verify"])

	return create(alg, private_key, public_key, "asdf", iss, 1000)
}

const get_rsa_wjwt = async () => {
	const alg = { name: "RSA-PSS", hash: { name: "SHA-256" }, modulusLength: 4096, publicExponent, saltLength: 32 } as const
	const { privateKey: private_key, publicKey: public_key } = await crypto.subtle.generateKey(alg, false, ["sign", "verify"])

	return create(alg, private_key, public_key, "asdf", iss, 1000)
}

test("wjwt should sign given payload with ECDSA", async () => {
	const wjwt = await get_ecdsa_wjwt()
	const signed = await wjwt.sign(payload)

	expect(signed[0]).toBeTypeOf("string")
})

test("wjwt should verify given token with ECDSA", async () => {
	const wjwt = await get_ecdsa_wjwt()
	const signed = await wjwt.sign(payload)
	const verified = await wjwt.verify(signed[0])

	expect(verified).toBeTrue()
})

test("wjwt should sign given payload with RSA", async () => {
	const wjwt = await get_rsa_wjwt()
	const signed = await wjwt.sign(payload)

	expect(signed[0]).toBeTypeOf("string")
})

test("wjwt should verify given token with RSA", async () => {
	const wjwt = await get_rsa_wjwt()
	const signed = await wjwt.sign(payload)
	const verified = await wjwt.verify(signed[0])

	expect(verified).toBeTrue()
})

test("wjwt should decode given token", async () => {
	const wjwt = await get_ecdsa_wjwt()
	const signed = await wjwt.sign(payload)
	const decoded = wjwt.decode(signed[0])

	expect(decoded && decoded.payload).toEqual(payload)
})
