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

import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Result } from "@ordo-pink/result"
import { type TGetFetchFn } from "@ordo-pink/core"
import { type TLogger } from "@ordo-pink/logger"
import { call_once } from "@ordo-pink/tau"

const fetch = window.fetch

type TInitFetchFn = (params: { logger: TLogger }) => { get_fetch: TGetFetchFn }
export const init_fetch: TInitFetchFn = call_once(({ logger }) => {
	logger.debug("🟡 Initialising fetch...")

	window.fetch = undefined as any
	window.XMLHttpRequest = undefined as any

	logger.debug("🟢 Initialised fetch.")

	return {
		get_fetch: fid => () =>
			Result.If(KnownFunctions.check_permissions(fid, { queries: ["application.fetch"] })).cata({
				Ok: () => fetch,
				Err: () => forbidden_fetch,
			}),
	}
})

// --- Internal ---

const forbidden_fetch = (() =>
	Promise.reject(
		"🔴 Using fetch was not requested by the function.",
	)) as unknown as typeof window.fetch
