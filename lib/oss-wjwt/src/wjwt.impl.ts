/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Lib from "./wjwt.types"
import { decode } from "./decode"
import { sign } from "./sign"
import { verify } from "./verify"

export const create: Lib.Create = (alg, private_key, public_key, aud, iss, token_lifetime) => ({
	sign: sign(private_key, alg, token_lifetime, iss, aud) as any,
	verify: verify(public_key, alg, aud),
	decode: decode as any,
})
