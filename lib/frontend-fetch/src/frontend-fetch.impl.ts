// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { Either } from "@ordo-pink/either"
import { KnownFunctions } from "@ordo-pink/known-functions"
import { Logger } from "@ordo-pink/logger"
import { callOnce } from "@ordo-pink/tau"
import { getLogger } from "@ordo-pink/frontend-logger"
import { useSharedContext } from "@ordo-pink/frontend-react-hooks"

const fetch = window.fetch

export const __initFetch = callOnce(() => {
	window.fetch = undefined as any
	window.XMLHttpRequest = undefined as any
})

export const useFetch = () => {
	const { fid } = useSharedContext()
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
