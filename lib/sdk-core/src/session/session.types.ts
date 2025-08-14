/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import * as Timestamp from "../timestamp/timestamp.types"
import { GenericGuard } from "../sdk-core.types"

/** Time at which the session was issued. */
export type IssuedAt = Timestamp.Instance

/** Readable name of the session to be displayed to the user. */
export type Name = string

export type Instance = [issued_at: IssuedAt, name: Name]

export type GetIssuedAt = (session: Instance) => IssuedAt
export type GetName = (session: Instance) => Name

export type Guard = GenericGuard<Instance>

/** Checks whether the session was issued in this many seconds back from now. */
export type WasActiveIn = (seconds: number, session: Instance) => boolean
