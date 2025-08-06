/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: AGPL-3.0-only
 *
 * Ordo.pink is an all-in-one team workspace.
 * Copyright (C) 2025  谢尔盖 ||↓ and the Ordo.pink contributors
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

import { core } from "@ordo-pink/sdk-core"
import { curry } from "@ordo-pink/oss-curry"
import { oath } from "@ordo-pink/oss-oath"

import type * as Lib from "./b-strategy-codegen-bun.types"

export const create: Lib.Create = algorithm => ({
	generate: () =>
		oath
			.of(new Uint8Array(6))
			.pipe(oath.ops.map(ua => crypto.getRandomValues(ua)))
			.pipe(oath.ops.and(ns => ns.join("")))
			.pipe(oath.ops.and(s => s.slice(0, 6))),

	hash: code => oath.from_promise(() => Bun.password.hash(code, algorithm)).pipe(oath.ops.rmap(eio("Failed to hash code"))),

	verify: (hash, code) =>
		oath.from_promise(() => Bun.password.verify(code, hash)).pipe(oath.ops.rmap(eio("Failed to verify code"))),
})

// --- Internal ---

const eio = curry(core.rrr.eio)
