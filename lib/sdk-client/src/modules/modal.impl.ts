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
	interface cmd {
		modal: {
			hide: { args: void }
			show: { args: OrdoClient.Modal.Params }
		}
	}

	namespace OrdoClient.Modal {
		type Params = { onunmount?: () => void; render: (div: HTMLDivElement) => void | Promise<void>; size?: CONSTANTS.SIZE }
	}
}
