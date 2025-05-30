/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export namespace GetDeviceInfo {
	export type Fn = (navigator: Navigator) => DeviceInfo

	export type DeviceInfo = `${string} ${string} (${string})`
}
