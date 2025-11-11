/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	interface cmd {
		title: {
			set_title: { args: OrdoClient.Translations.Key }
		}
	}
}

export {}
