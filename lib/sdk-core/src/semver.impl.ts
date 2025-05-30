import { sweech } from "@ordo-pink/sweech"

import { is_string } from "./validations.impl"

export namespace sem_ver {
	export const RX =
		/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-((?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*)(?:\.(?:0|[1-9]\d*|\d*[a-zA-Z-][0-9a-zA-Z-]*))*))?(?:\+([0-9a-zA-Z-]+(?:\.[0-9a-zA-Z-]+)*))?$/

	export const is_sem_ver = (x: any): x is SemVer.Version => is_string(x) && RX.test(x)

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

export namespace SemVer {
	export type Major = `${number}` & {}
	export type Minor = `${number}` & {}
	export type Patch = `${number}` & {}
	export type Build = string & {}
	export type PreRelease = string & {}
	export type Version =
		| `${Major}.${Minor}.${Patch}`
		| `${Major}.${Minor}.${Patch}+${Build}`
		| `${Major}.${Minor}.${Patch}-${PreRelease}`
		| `${Major}.${Minor}.${Patch}-${PreRelease}+${Build}`
}
