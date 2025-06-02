/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace Progress {
	export type Instance = {
		start: (message: string) => void
		inc: (message?: string) => void
		finish: () => void
		break: (message: string) => void
	}

	export type Fn = (message: string) => Instance
}
