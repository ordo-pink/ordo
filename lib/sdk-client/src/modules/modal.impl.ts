/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace CONSTANTS {
	export enum SIZE {
		SM,
		MD,
		LG,
		XL,
		XXL,
	}
}

declare global {
	namespace OrdoClient.Modal {
		export type Size = (typeof CONSTANTS.SIZE)[keyof typeof CONSTANTS.SIZE]

		type Instance = { onunmount?: () => void; render: (div: HTMLDivElement) => void | Promise<void>; size?: CONSTANTS.SIZE }
	}
}
