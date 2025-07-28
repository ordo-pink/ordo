/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type Major = `${number}` & {}
export type Minor = `${number}` & {}
export type Patch = `${number}` & {}
export type Build = string & {}
export type PreRelease = string & {}
export type Instance =
	| `${Major}.${Minor}.${Patch}`
	| `${Major}.${Minor}.${Patch}+${Build}`
	| `${Major}.${Minor}.${Patch}-${PreRelease}`
	| `${Major}.${Minor}.${Patch}-${PreRelease}+${Build}`

export type Create = (major: Major, minor?: Minor, patch?: Patch, build?: Build, pre_release?: PreRelease) => Instance
