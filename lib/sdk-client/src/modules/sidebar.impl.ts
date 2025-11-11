/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

declare global {
	interface cmd {
		sidebar: {
			enable: { args: void }
			disable: { args: void }
			show: { args: void }
			hide: { args: void }
			toggle: { args: void }
		}
	}
}

export {}
