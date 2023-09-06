// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { Validations } from "./data-validations.types"
import { isNonEmptyString, isNonNegativeFiniteInteger, isUUID } from "@ordo-pink/tau"
import { Either } from "@ordo-pink/either"
import { Errors } from "./errors.impl"

export const validations: Validations = {
	isValidNameE: x =>
		Either.fromBoolean(
			() => isNonEmptyString(x),
			() => x,
			() => Errors.InvalidName,
		),
	isValidSizeE: x =>
		Either.fromBoolean(
			() => isNonNegativeFiniteInteger(x),
			() => x,
			() => Errors.InvalidSize,
		),
	isValidTimestampE: x =>
		Either.fromBoolean(
			() => isNonNegativeFiniteInteger(x),
			() => x,
			() => Errors.InvalidTimestamp,
		),
	isValidFsidE: x =>
		Either.fromBoolean(
			() => isUUID(x),
			() => x,
			() => Errors.InvalidFSID,
		),
	isValidParentE: x =>
		Either.fromBoolean(
			() => x === null || isUUID(x),
			() => x,
			() => Errors.InvalidFSID,
		),
	isValidSubE: x =>
		Either.fromBoolean(
			() => isUUID(x),
			() => x,
			() => Errors.InvalidSUB,
		),
	isValidLabelE: x =>
		Either.fromBoolean(
			() => isNonEmptyString(x),
			() => x,
			() => Errors.InvalidLabel,
		),
}
