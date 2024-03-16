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

import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/frontend-known-functions"
import { Logger } from "@ordo-pink/logger"
import { callOnce } from "@ordo-pink/tau"
import { getLogger } from "@ordo-pink/frontend-logger"
import { useCurrentFID } from "@ordo-pink/frontend-stream-activities"

const fetch = window.fetch

export const __initFetch = callOnce(() => {
	window.fetch = undefined as any
	window.XMLHttpRequest = undefined as any
})

export const useFetch = () => {
	const fid = useCurrentFID()
	const fetch = getFetch(fid)

	return fetch
}

export const getFetch = (fid: symbol | null): typeof window.fetch =>
	Either.fromBoolean(() => KnownFunctions.checkPermissions(fid, { queries: ["fetch"] }))
		.leftMap(() => getLogger(fid))
		.fold(forbiddenFetch, () => fetch)

// --- Internal ---

const forbiddenFetch = (logger: Logger) =>
	(() => {
		logger.alert("You are not authorised to execute fetch calls.")
		return Promise.reject("Forbidden")
	}) as unknown as typeof window.fetch
