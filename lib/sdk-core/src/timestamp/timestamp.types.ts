/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { GenericGuard as GenericGuard } from "../sdk-core.types"

export type Instance = number

export type Create = () => Instance
export type Guard = GenericGuard<Instance>

export type IsAfter = (inclusive_start: Instance, value: Instance) => boolean
export type IsBefore = (exclusive_end: Instance, value: Instance) => boolean
export type IsWithin = (inclusive_start: Instance, exclusive_end: Instance, value: Instance) => boolean
