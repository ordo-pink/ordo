// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { FSID, UserID } from "./data.types"
import type { TEither } from "@ordo-pink/either"
import type { DataError } from "./errors.types"
import type { Nullable } from "@ordo-pink/tau"

export type Validation<Expected> = (x: Expected) => TEither<Expected, DataError>

export type Validations = {
	isValidNameE: Validation<string>
	isValidSizeE: Validation<number>
	isValidParentE: Validation<Nullable<FSID>>
	isValidTimestampE: Validation<number>
	isValidFsidE: Validation<FSID>
	isValidSubE: Validation<UserID>
	isValidLabelE: Validation<string>
}
