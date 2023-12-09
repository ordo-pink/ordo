// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MPL-2.0

// This Source Code Form is subject to the terms of the Mozilla Public
// License, v. 2.0. If a copy of the MPL was not distributed with this
// file, You can obtain one at http://mozilla.org/MPL/2.0/.

import { Oath } from "@ordo-pink/oath"
import { Errors } from "@ordo-pink/rrr"
import { Switch } from "@ordo-pink/switch"
import { isInstanceOf } from "@ordo-pink/tau"

/**
 * Import provided public key.
 * TODO: Accept algorithm.
 */
export const importPublicKey0 = (key: string) => importKey0(key, "public")

/**
 * Import provided private key.
 * TODO: Accept algorithm.
 */
export const importPrivateKey0 = (key: string) => importKey0(key, "private")

// --- Internal ---

type AccessLevel = "public" | "private"

const format = { public: "spki" as const, private: "pkcs8" as const }
const alg = { name: "ECDSA", namedCurve: "P-384" } // TODO: Accept algorithm.
const keyUsages = { public: ["verify" as const], private: ["sign" as const] }
const errors = Errors({
	InvalidKeyUsage: "Key usage is set up incorrectly",
	InvalidKeyData: "Invalid key data",
	KeyNotProvided: "Key not provided",
} as const)

const importKey0 = (key: string, access: AccessLevel) =>
	Oath.fromNullable(key)
		.rejectedMap(errors.KeyNotProvided)
		.map(stringToBase64Buffer)
		.map(bufferToUint8Array)
		.chain(importCryptoKey0(access))

const stringToBase64Buffer = (key: string) => Buffer.from(key, "base64")

const bufferToUint8Array = (buffer: Buffer) => new Uint8Array(buffer)

const importKeyP = (key: Uint8Array, access: AccessLevel) =>
	crypto.subtle.importKey(format[access], key, alg, true, keyUsages[access])

const importCryptoKey0 = (access: AccessLevel) => (key: Uint8Array) =>
	Oath.from<CryptoKey, Error>(() => importKeyP(key, access)).rejectedMap(stringifyError)

const stringifyError = (error: Error) =>
	Switch.of(error)
		.case(isInstanceOf(SyntaxError), errors.InvalidKeyUsage)
		.default(errors.InvalidKeyData)
