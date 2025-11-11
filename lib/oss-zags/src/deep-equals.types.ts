/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

/**
 * Checks deep equality of two provided elements. Recursively checks equality for objects and arrays.
 */
export type DeepEquals = (x: unknown, y: unknown) => boolean
