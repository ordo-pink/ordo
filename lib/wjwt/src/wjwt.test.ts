/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { expect, test } from "bun:test"

import { N } from "@ordo-pink/tau"
import { invokers0 } from "@ordo-pink/oath"

import { WJWT } from "./wjwt"

const payload = {
	aud: ["asdf"],
	exp: Date.now() / 1000 + 600,
	iat: Date.now(),
	iss: "asdf",
	jti: crypto.randomUUID(),
	sub: crypto.randomUUID(),
}
const getEcdsaWjwt = async () => {
	const { privateKey, publicKey } = await crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, [
		"sign",
		"verify",
	])

	return WJWT({ alg: { name: "ECDSA", hash: "SHA-256" } as any, privateKey, publicKey })
}

const getRsaWjwt = async () => {
	const { privateKey, publicKey } = await crypto.subtle.generateKey(
		{
			name: "RSA-PSS",
			hash: "SHA-256",
			modulusLength: 4096,
			publicExponent: new Uint8Array([0x01, 0x00, 0x01]),
		} as any,
		false,
		["sign", "verify"],
	)

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
	const signed = await wjwt.sign0(payload).invoke(invokers0.or_else(N))

	expect(signed).toBeTypeOf("string")
})

test("wjwt should verify given token with ECDSA", async () => {
	const wjwt = await getEcdsaWjwt()
	const signed = await wjwt.sign0(payload).invoke(invokers0.or_else(() => ""))
	const verified = await wjwt.verify0(signed).fork(
		l => l,
		r => r,
	)

	expect(verified).toBeTrue()
})

test("wjwt should sign given payload with RSA", async () => {
	const wjwt = await getRsaWjwt()
	const signed = await wjwt.sign0(payload).invoke(invokers0.or_else(N))

	expect(signed).toBeTypeOf("string")
})

test("wjwt should verify given token with RSA", async () => {
	const wjwt = await getRsaWjwt()
	const signed = await wjwt.sign0(payload).invoke(invokers0.or_else(() => ""))
	const verified = await wjwt.verify0(signed).fork(
		l => l,
		r => r,
	)

	expect(verified).toBeTrue()
})

test("wjwt should decode given token", async () => {
	const wjwt = await getEcdsaWjwt()
	const signed = await wjwt.sign0(payload).invoke(invokers0.or_else(() => ""))
	const decoded = await wjwt.decode0(signed).invoke(invokers0.or_nothing)

	expect(decoded && decoded.payload).toEqual(payload)
})
