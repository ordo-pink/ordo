/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import { GenericGuard as GenericGuard } from "../sdk-core.types"

export type Instance = `${string}-${string}-${string}-${string}-${string}`

export type Guard = GenericGuard<Instance>

export type Create = () => Instance
