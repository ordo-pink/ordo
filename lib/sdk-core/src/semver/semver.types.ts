/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace SemVer {
	export type Major = `${number}` & {}
	export type Minor = `${number}` & {}
	export type Patch = `${number}` & {}
	export type Build = string & {}
	export type PreRelease = string & {}
	export type Version =
		| `${SemVer.Major}.${SemVer.Minor}.${SemVer.Patch}`
		| `${SemVer.Major}.${SemVer.Minor}.${SemVer.Patch}+${SemVer.Build}`
		| `${SemVer.Major}.${SemVer.Minor}.${SemVer.Patch}-${SemVer.PreRelease}`
		| `${SemVer.Major}.${SemVer.Minor}.${SemVer.Patch}-${SemVer.PreRelease}+${SemVer.Build}`
}
