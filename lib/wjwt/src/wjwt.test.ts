// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: AGPL-3.0-only

// Ordo.pink is an all-in-one team workspace.
// Copyright (C) 2024  谢尔盖||↓ and the Ordo.pink contributors

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU Affero General Public License as published
// by the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU Affero General Public License for more details.

// You should have received a copy of the GNU Affero General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

import { expect, test } from "bun:test"
import { SUB } from "./wjwt.types"
import { WJWT } from "./wjwt"

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
	const decoded = await wjwt.decode0(signed).orNothing()

	expect(decoded && decoded.payload).toEqual(payload)
})
