/*
 * SPDX-FileCopyrightText: Copyright 2024, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { TWJWT } from "./wjwt.types"
import { decode0 } from "./_decode"
import { sign0 } from "./_sign"
import { verify0 } from "./_verify"

export const WJWT: TWJWT = ({ alg, privateKey, publicKey }) => ({
	sign0: sign0({ alg, key: privateKey }),
	verify0: verify0({ alg, key: publicKey }),
	decode0,
})
