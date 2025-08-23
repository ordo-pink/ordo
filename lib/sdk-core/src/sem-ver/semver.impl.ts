/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { sweech_helpers } from "@ordo-pink/oss-sweech/extensions"

import * as SEM_VER from "./sem-ver.constants"
import type * as SemVer from "./semver.types"
import * as fns from "../fns/fns.impl"

export const is_sem_ver = (x: any): x is SemVer.Instance => fns.is_string(x) && SEM_VER.RX.test(x)

export const create: SemVer.Create = (major, minor = "0", patch = "0", pre_release, build): SemVer.Instance =>
	sweech_helpers
		.of_true()
		.case(!!pre_release && !!build, () => `${major}.${minor}.${patch}-${pre_release}+${build}`)
		.case(!!pre_release, () => `${major}.${minor}.${patch}-${pre_release}`)
		.case(!!build, () => `${major}.${minor}.${patch}+${build}`)
		.default(() => `${major}.${minor}.${patch}`) as SemVer.Instance
