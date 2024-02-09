// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { TEither } from "@ordo-pink/either"

import type { FSID, PlainData, UserID } from "./data.types"
import type { DataError } from "./errors.types"

export type Validation<Expected> = (x: Expected) => TEither<Expected, DataError>

export type Validations = {
	isValidNameE: Validation<string>
	isValidSizeE: Validation<number>
	isValidParentE: Validation<FSID | null>
	isValidTimestampE: Validation<number>
	isValidFsidE: Validation<FSID>
	isValidSubE: Validation<UserID>
	isValidStringE: Validation<string>
	isValidDataE: Validation<PlainData>
	isValidPropertiesE: Validation<Record<string, unknown> | undefined>
}
