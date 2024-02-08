// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

// TODO: Move extension state to /var/${extension}
export const EXTENSION_FILE_PREFIX = ".ext_"

export const ORDO_PINK_APP_FUNCTION = "pink.ordo.app"
export const ORDO_PINK_USER_FUNCTION = "pink.ordo.user"

export const enum BackgroundTaskStatus {
	NONE,
	SAVING,
	LOADING,
}
