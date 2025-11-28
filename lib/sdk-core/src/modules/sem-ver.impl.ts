/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { impl as validations } from "./validations.impl"

export namespace CONSTANTS {
	export const FIRSTBORN = "0.1.0"
}

export namespace impl {
	export const rx =
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

	export const guard: Ordo.SemVer.Guard = (x): x is Ordo.SemVer.Instance => validations.is_string(x) && rx.test(x)

	export const create: Ordo.SemVer.Create = (major = "0", minor = "1", patch = "0", pre_release, build) => {
		if (pre_release && build) return `${major}.${minor}.${patch}-${pre_release}+${build}`
		if (pre_release) return `${major}.${minor}.${patch}-${pre_release}`
		if (build) return `${major}.${minor}.${patch}+${build}`
		return `${major}.${minor}.${patch}`
	}
}

declare global {
	namespace Ordo.SemVer {
		export type Major = `${number}`
		export type Minor = `${number}`
		export type Patch = `${number}`
		export type Build = string
		export type PreRelease = string

		export type Instance =
			| `${Major}.${Minor}.${Patch}`
			| `${Major}.${Minor}.${Patch}+${Build}`
			| `${Major}.${Minor}.${Patch}-${PreRelease}`
			| `${Major}.${Minor}.${Patch}-${PreRelease}+${Build}`

		export type Guard = Ordo.GenericGuard<Instance>

		export type CreateArgs = [major?: Major, minor?: Minor, patch?: Patch, build?: Build, pre_release?: PreRelease]

		export type Create = (...args: CreateArgs) => Instance

		export type GetMajor = (version: Instance) => Major
		export type GetMinor = (version: Instance) => Minor
		export type GetPatch = (version: Instance) => Patch
		export type GetBuild = (version: Instance) => Build
		export type GetPreRelease = (version: Instance) => PreRelease

		export type SetMajor = Ordo.Fns.Curried<(major: Major, version: Instance) => Instance>
		export type SetMinor = Ordo.Fns.Curried<(minor: Minor, version: Instance) => Instance>
		export type SetPatch = Ordo.Fns.Curried<(patch: Patch, version: Instance) => Instance>
		export type SetBuild = Ordo.Fns.Curried<(build: Build, version: Instance) => Instance>
		export type SetPreRelease = Ordo.Fns.Curried<(pre_release: PreRelease, version: Instance) => Instance>
	}
}
