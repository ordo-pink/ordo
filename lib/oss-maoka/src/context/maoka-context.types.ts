/*
 * SPDX-FileCopyrightText: Copyright 2025, 谢尔盖 ||↓ and the Ordo.pink contributors
 * SPDX-License-Identifier: Unlicense
 */

import type { Id, Jab } from "../maoka.types.ts"

/** Global internal state of the context. Uses {@link Maoka.Root root} id to evaluate access rights. */
export type ContextInternalState = Record<Id, any>

/** Context instance. */
export type ContextInstance<$Value> = {
	/** Consume jab returns whatever was provided to the context under the current maoka root. */
	consume: Jab<$Value>
	/** Provides whatever passed to the context under the current maoka root. */
	provide: (value: $Value) => Jab
}

/** Creates context instance bound to the current {@link Maoka.Root maoka root} node. */
export type CreateContext = <$Value>() => ContextInstance<$Value>
