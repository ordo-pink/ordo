/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as PERMISSION from "./permission.constants"
import type { GenericGuard } from "../sdk-core.types"

export type Instance = PERMISSION.VALUE
export type Action = PERMISSION.ACTION

export type Full = () => Instance
export type Empty = () => Instance

export type Guard = GenericGuard<Instance>

export type CheckPermission = (action: PERMISSION.ACTION, permission: Instance) => boolean
