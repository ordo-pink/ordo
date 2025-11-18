/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace CONSTANTS {
	export enum STATUS {
		NONE,
		SAVING,
		LOADING,
		length,
	}
}

declare global {
	interface cmd {
		background_status: {
			saving: { args: void }
			loading: { args: void }
			reset: { args: void }
		}
	}

	namespace OrdoClient.BackgroundTask {
		type Status = CONSTANTS.STATUS
	}
}
