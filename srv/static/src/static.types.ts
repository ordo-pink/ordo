// SPDX-FileCopyrightText: Copyright 2023, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: MIT

import type { BunFile } from "bun"

/**
 * Intermediate state that exists in a closure for every request.
 */
export type StaticMiddlewareState = { time: number; file: BunFile }
