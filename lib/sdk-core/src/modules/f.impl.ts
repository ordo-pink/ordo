/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { impl as sem_ver } from "./sem-ver.impl"
import { impl as validations } from "./validations.impl"

export namespace CONSTANTS {
	export const ROOT = "@ordo/main"

	export const RX = /^@[a-z0-9_.-]+\/[a-z0-9_.-]+$/

	export enum STATUS {
		DISABLED,
		ENABLED,
	}
}

export namespace impl {
	export const name_guard: Ordo.F.NameGuard = (x): x is Ordo.F.Name =>
		validations.is_string(x) && x !== CONSTANTS.ROOT && new TextEncoder().encode(x).byteLength <= 100 && CONSTANTS.RX.test(x)

	export const guard: Ordo.F.Guard = (x): x is Ordo.F.Instance =>
		result
			.if_else(validations.is_string(x), { on_true: () => x as string })
			.pipe(result.ops.map(x => x.split(":v")))
			.pipe(result.ops.chain(parts => result.if_else(parts.length === 2, { on_true: () => parts })))
			.pipe(result.ops.map(([name, version]) => name_guard(name) && sem_ver.guard(version)))
			.cata(result.catas.or_else(() => false))
}

declare global {
	namespace Ordo.F {
		type OrgName = string
		type FName = string
		type Name = `@${OrgName}/${FName}`
		type Instance = `${Name}:v${SemVer.Instance}`
		type NameGuard = GenericGuard<Name>
		type Guard = GenericGuard<Instance>
	}
}
