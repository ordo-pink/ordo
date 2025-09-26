/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	namespace OrdoClient {
		export type Fetch = (input: string | URL | Request, init?: RequestInit) => Promise<Response>
	}
}

export {}
