// SPDX-FileCopyrightText: Copyright 2024, 谢尔盖||↓ and the Ordo.pink contributors
// SPDX-License-Identifier: Unlicense

import {
	type TAttributes,
	type TMaokaCallback,
	type TCreateComponentFn,
	type TExtractCallbackHooks,
} from "@ordo-pink/maoka/src/maoka.types"
import { is_fn } from "@ordo-pink/tau"

export const to_chainable_component =
	<$TCustomHooks extends Record<string, unknown> = Record<string, unknown>>(
		create_component: TCreateComponentFn<$TCustomHooks>,
	) =>
	(name: string) =>
	(
		attrs_or_cb: TAttributes | TMaokaCallback<TExtractCallbackHooks<typeof create_component>>,
		callback?: TMaokaCallback<TExtractCallbackHooks<typeof create_component>>,
	) => {
		const attrs_is_attrs = !is_fn(attrs_or_cb)

		const attrs = attrs_is_attrs ? (attrs_or_cb as TAttributes) : {}
		const cb = attrs_is_attrs
			? callback
			: (attrs_or_cb as TMaokaCallback<TExtractCallbackHooks<typeof create_component>>)

		return create_component(name, attrs, cb)
	}
