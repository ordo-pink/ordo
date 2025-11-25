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
	namespace OrdoClient.BackgroundTask {
		type Status = CONSTANTS.STATUS
	}
}
