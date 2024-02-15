// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import { isNonEmptyString, isNonNegativeFiniteInteger, isObject, isUUID } from "@ordo-pink/tau"
import { Either } from "@ordo-pink/either"

import { DataError } from "./errors.types"
import { Errors } from "./errors.impl"
import { type Validations } from "./data-validations.types"

export const validations: Validations = {
	isValidDataE: x =>
		Either.fromBoolean(() => isObject(x))
			.chain(() => validations.isValidFsidE(x.fsid))
			.chain(() => validations.isValidParentE(x.parent))
			.chain(() => validations.isValidNameE(x.name))
			.chain(() => validations.isValidSizeE(x.size))
			.chain(() => validations.isValidTimestampE(x.createdAt))
			.chain(() => validations.isValidTimestampE(x.updatedAt))
			.chain(() => validations.isValidSubE(x.createdBy))
			.chain(() => validations.isValidSubE(x.updatedBy))
			.chain(() => validations.isValidPropertiesE(x.properties))
			.chain(() =>
				x.links.reduce((acc, v) => acc.chain(() => validations.isValidFsidE(v)), Either.right("")),
			)
			.chain(() =>
				x.labels.reduce(
					(acc, v) => acc.chain(() => validations.isValidStringE(v)),
					Either.right(""),
				),
			)
			.map(() => x)
			.leftMap(e => e as DataError),
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
	isValidStringE: x =>
		Either.fromBoolean(
			() => isNonEmptyString(x),
			() => x,
			() => Errors.InvalidLabel,
		),
	isValidPropertiesE: x =>
		Either.fromBoolean(
			() => typeof x === "undefined" || isObject(x),
			() => x,
			() => Errors.InvalidProperties,
		),
}
