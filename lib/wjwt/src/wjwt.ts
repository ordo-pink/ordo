/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TWJWTFn } from "./wjwt.types"
import { decode } from "./decode"
import { sign } from "./sign"
import { verify } from "./verify"

export const WJWT: TWJWTFn = ({ alg, private_key, public_key, aud, iss, token_lifetime }) => ({
	sign: sign({ alg, key: private_key, iss, token_lifetime, aud }),
	verify: verify({ alg, key: public_key, aud }),
	decode,
})
