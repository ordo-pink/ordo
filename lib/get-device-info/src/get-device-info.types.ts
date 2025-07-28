/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

export type GetDeviceInfo = (navigator: Navigator) => DeviceInfo

export type IsDeviceInfo = (x: any) => x is DeviceInfo

export type DeviceInfo = `${string} ${string} (${string})`
