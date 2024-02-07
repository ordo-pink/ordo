// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

export enum ComponentSpace {
	ICON,
	CARD,
	WIDGET,
	BANNER,
	WORKSPACE,
}

export const EXTENSION_FILE_PREFIX = ".ext_"

export const ORDO_PINK_APP_FUNCTION = "pink.ordo.app"
export const ORDO_PINK_USER_FUNCTION = "pink.ordo.user"

export const enum BackgroundTaskStatus {
	NONE,
	SAVING,
	LOADING,
}
