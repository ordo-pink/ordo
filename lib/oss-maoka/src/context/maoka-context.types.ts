/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type * as Maoka from "../maoka.types"

/** Global internal state of the context. Uses {@link Maoka.Root root} id to evaluate access rights. */
export type InternalState = Record<Maoka.Id, any>

/** Context instance. */
export type Instance<$Value> = {
	/** Consume jab returns whatever was provided to the context under the current maoka root. */
	consume: Maoka.Jab<$Value>
	/** Provides whatever passed to the context under the current maoka root. */
	provide: (value: $Value) => Maoka.Jab
}

/** Creates context instance bound to the current {@link Maoka..Root maoka root} node. */
export type Create = <$Value>() => Instance<$Value>
