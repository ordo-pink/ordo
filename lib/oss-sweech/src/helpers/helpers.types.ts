/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Instance } from "../sweech.types"

/**
 * Create an empty switch that compares provided values against `true`.
 */
export type OfTrue = () => Instance<boolean>

/**
 * Create an empty switch that compares provided values against `false`.
 */
export type OfFalse = () => Instance<boolean>
