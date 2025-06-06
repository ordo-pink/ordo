/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { sweech } from "@ordo-pink/sweech"

import type { SemVer } from "./semver.types"
import { core } from "../core/core.impl"

export namespace sem_ver {
	export const is_sem_ver = (x: any): x is SemVer.Version => core.validations.is_string(x) && core.rx.semantic_version.test(x)

	export const create = (
		major: SemVer.Major,
		minor: SemVer.Minor = "0",
		patch: SemVer.Patch = "0",
		pre_release: SemVer.PreRelease | null = null,
		build: SemVer.Build | null = null,
	): SemVer.Version =>
		sweech
			.of_true()
			.case(!!pre_release && !!build, () => `${major}.${minor}.${patch}-${pre_release}+${build}`)
			.case(!!pre_release, () => `${major}.${minor}.${patch}-${pre_release}`)
			.case(!!build, () => `${major}.${minor}.${patch}+${build}`)
			.default(() => `${major}.${minor}.${patch}`) as SemVer.Version
}
